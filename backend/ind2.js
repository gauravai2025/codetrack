const express = require('express');
const { DBConnection } = require('./database/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const User = require('./models/Users');
const Contest = require('./models/Contest');
const bodyParser = require('body-parser');
const executeCpp = require("./src/executeCpp.js")
const cors = require('cors')
const multer = require('multer');
const path = require('path');
const generateFile = require("./src/generateFile");
const executeCppForRun = require("./src/executeCppForRun.js")
const executePythonForRun = require("./src/executePythonForRun.js");
const executePython = require("./src/executePython");
const executeJavaForRun = require("./src/executeJavaForRun");
const executeJava = require("./src/executeJava");
const { log } = require('console');
const fs = require("fs");
// creating express app
const app = express();

// middlewares
app.use(express.json());
// app.use(cors());
// app.use(cors({ credentials: true }))
app.use(cors({
    origin: 'http://127.0.0.1:5173', // Replace with your frontend URL
    credentials: true  // Allow credentials (cookies)
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true })); app.use(cookieParser());


// Multer configuration for image storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname.startsWith('images-') || file.fieldname === 'contestImage' || file.fieldname === 'profilePhoto') {
            cb(null, 'src/uploads/images/');
        } else {
            cb(null, 'src/uploads/');
        }
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    },
});
const upload = multer({ storage: storage });

const imagesDir = path.join(__dirname, 'src/uploads/images');
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
}
app.use('/uploads/images', express.static(path.join(__dirname, 'src', 'uploads', 'images')));
app.use('/uploads', express.static(path.join(__dirname, 'src', 'uploads')));


// routes
app.get('/', (req, res) => {
    res.send('Welcome to backend!');
});

app.post('/register', async (req, res) => {
    try {
        // get data from request body
        const { username, email, password, adminRole } = req.body;

        // check all data received
        if (!(username && email && password)) {
            return res.status(400).send("Please enter all the required fields");
        }

        // check if user exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            console.log(email);
            return res.status(400).send("User already exists. Enter a new email.");
        }

        // encrypt password
        const hashedPassword = bcrypt.hashSync(password, 10);

        // save user
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            adminRole: adminRole || false
        });

        // generate token for user
        const token = jwt.sign({ id: user._id, email }, process.env.SECRET_KEY, {
            expiresIn: '1h'
        });

        // send the response and object
        user.password = undefined;
        res.status(201).json({ message: "New user successfully created", user, token });

    } catch (err) {
        console.log("Error while registering", err);
        res.status(500).send("Internal Server Error");
    }
});

// Example of setting cookie in Node.js (Express.js)
app.post('/login', async (req, res) => {
    try {
        // get details
        const { email, password } = req.body;

        // find user
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(400).send("You are not registered. Please register to gain access.");
        }

        // compare passwords
        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            return res.status(400).send("Wrong password");
        }

        // generate token for user
        const token = jwt.sign({ userEmail: existingUser.email, role: existingUser.adminRole }, process.env.SECRET_KEY, { expiresIn: "1h" });
        res.cookie("token", token, { secure: true, sameSite: "None", maxAge: 3600000 });
        res.json({ userEmail: existingUser.email, token, adminRole: existingUser.adminRole }); // Return the user's role along with the token

    } catch (err) {
        console.log("Error while logging in", err);
        res.status(500).send("Internal Server Error");
    }
});

app.post('/logout', (req, res) => {
    // Logic to handle logout, e.g., invalidating tokens, clearing session
    res.clearCookie("token"); // clear the cookie from the client
    res.clearCookie("role"); // clear the cookie from the client
    res.status(200).json({ message: "Logout successful" });
    res.status(200).send({ message: 'Logout successful' });
});

// Middleware to handle multipart/form-data and store files
app.post('/create', upload.any(), async (req, res) => {
    console.log("create called ");
    console.log("problems : ", req.body.problems);

    const { useremail, contestName, duration, startTime, endTime } = req.body;
    console.log("files: ", req.files);

    try {
        // Parse problems data from req.body.problems
        let problems = req.body.problems;
        if (typeof problems === 'string') {
            problems = JSON.parse(problems);
        }

        // Attach file paths if files are uploaded
        problems = problems.map((problem, index) => {
            const images = req.files
                .filter(file => file.fieldname.startsWith(`images-${index}`))
                .map(file => path.join('uploads/images', path.basename(file.path)));

            return {
                ...problem,
                inputFile: path.join('uploads', path.basename(req.files.find(file => file.fieldname === `problems[${index}][inputFile]`)?.path || '')),
                outputFile: path.join('uploads', path.basename(req.files.find(file => file.fieldname === `problems[${index}][outputFile]`)?.path || '')),
                images
            };
        });

        // Attach contest image if uploaded
        const contestImage = path.join('uploads/images', path.basename(req.files.find(file => file.fieldname === 'contestImage')?.path || ''));

        // Find the user
        let user = await User.findOne({ email: useremail });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Create new contest
        const newContest = new Contest({
            contestName,
            duration,
            startTime: new Date(startTime),
            endTime: new Date(endTime),
            problems,
            photo: contestImage,
            createdBy: user._id,
        });

        // Save the contest
        const savedContest = await newContest.save();

        // Add the contest reference to the user's contests
        user.contests.push(savedContest._id);
        await user.save();

        res.status(201).json({ message: 'Contest created successfully!', contest: savedContest });
    } catch (error) {
        console.error('Error creating contest:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});



//get contests
app.get('/getcontests', async (req, res) => {
    try {
        // Find users with adminRole: true
        const adminUsers = await User.find({ adminRole: true }).select('_id');
        const adminUserIds = adminUsers.map(user => user._id);

        // Find contests created by admin users
        const contests = await Contest.find({ createdBy: { $in: adminUserIds } })
            .populate('createdBy', 'username')
            .exec();

        res.json(contests);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route to fetch contest by ID
app.get('/contest/:id', async (req, res) => {
    try {
        const contestId = req.params.id;
        const contest = await Contest.findById(contestId).populate('createdBy', 'username').exec();

        if (!contest) {
            return res.status(404).json({ message: 'Contest not found' });
        }

        res.json(contest);
    } catch (error) {
        console.error('Error fetching contest by ID:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Route to fetch problems from contests whose end date has passed
app.get('/problemsFromExpiredContests', async (req, res) => {
    try {
        // Get current date/time
        const currentDate = new Date();

        // Query contests where end time is less than current date
        const contests = await Contest.find({ endTime: { $lt: currentDate } })
            .populate('problems', 'name description testCases index') // Assuming problems have 'index' field
            .exec();

        // Extract problems with additional contest details
        let problems = [];
        contests.forEach(contest => {
            var idx = 0;
            contest.problems.forEach(problem => {
                problems.push({
                    idx: idx,
                    contestName: contest.contestName,
                    contestId: contest._id,
                    endTime: contest.endTime,
                    problemName: problem.name,
                    problemIndex: problem.index,
                    description: problem.description,
                    testCases: problem.testCases
                });
                idx++;
            });
        });

        res.json(problems);
    } catch (err) {
        console.error('Error fetching problems from expired contests:', err);
        res.status(500).json({ error: err.message });
    }
});


// Static files route for uploaded files
// const uploadDir = path.join(`${__dirname}/src`, "uploads")
// if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(codeDir, { recursive: true });
// }


app.post("/run", async (req, res) => {
    const { language = "cpp", code, pretestIp } = req.body;
    if (code === "") {
        return res.status(400).json({ success: false, message: "Do write some code to submit!" });
    }
    try {
        console.log("pretests are: ", pretestIp);
        const filePath = await generateFile(language, code);
        console.log("before output ");

        let output;
        if (language === "cpp") {
            output = await executeCppForRun(filePath, pretestIp);
        } else if (language === "python") {
            output = await executePythonForRun(filePath, pretestIp);
        } else if (language === "java") {
            output = await executeJavaForRun(filePath, pretestIp);
        }

        console.log("after output ");
        res.send({ filePath, output });
    } catch (err) {
        console.error("Error executing code:", err);
        res.status(500).json({ success: false, message: "Error executing code", error: err.message });
    }
});

app.post("/submit", async (req, res) => {
    const { language = "cpp", code, ipath, opath, contestId, index, email } = req.body;
    console.log(email, " ", contestId, " ", index);

    if (code === "") {
        return res.status(400).json({ success: false, message: "Do write some code to submit!" });
    }

    try {
        const normalizeNewlines = (text) => {
            return text.replace(/\r\n/g, "\n"); // Convert Windows-style newlines to Unix-style newlines
        };
        const filePath = await generateFile(language, code);

        // Ensure the input file path is correct
        const inputFileName = path.basename(ipath);
        const inputFilePath = path.join(__dirname, "src", "uploads", inputFileName); // Correctly set input file path
        console.log("filepath: ", filePath, "inputpath: ", inputFilePath);

        // here check the filePath and inputFiilePath to replace \\ with /
        // Replace backslashes with forward slashes in the file paths
        const correctedFilePath = filePath.replace(/\\/g, '/');
        const correctedInputFilePath = inputFilePath.replace(/\\/g, '/');

        // Send the corrected file paths to executeCpp
        let output;
        if (language === "cpp") output = await executeCpp(correctedFilePath, correctedInputFilePath);
        else if (language === "java") output = await executeJava(correctedFilePath, correctedInputFilePath);
        else if (language === "python") output = await executePython(correctedFilePath, correctedInputFilePath);
        else res.status(500).json({ success: false, message: "Unexpected language selected" });

        // Ensure the output file path is correct
        const outputFileName = path.basename(opath);
        const outputFilePath = path.join(__dirname, "src", "uploads", outputFileName);
        const correctedOutputFilePath = outputFilePath.replace(/\\/g, '/');

        const expectedOutput = fs.readFileSync(correctedOutputFilePath, 'utf-8').trim();
        const corrExpectedOutput = normalizeNewlines(expectedOutput);
        let submissionResult;
        let message;

        if (output.trim() === corrExpectedOutput) {
            submissionResult = "ACC";
            message = "Accepted";
        } else {
            submissionResult = "WA";
            message = "Wrong Answer";
        }

        // Find the user by email and add the submission to their submissions array
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        user.submissions.push({
            contestId,
            submissionType: language,
            problemIndex: index,
            code,
            result: submissionResult,
            message,
            receivedOutput: output.trim(),
            expectedOutput
        });
        await user.save();

        if (submissionResult === "ACC") {
            const contest = await Contest.findById(contestId);
            if (!contest) {
                return res.status(404).json({ success: false, message: "Contest not found" });
            }

            if (contest.registrations.includes(email)) {
                let rankedUser = contest.rankings.find(user => user.userEmail === email);

                if (!rankedUser) {
                    rankedUser = {
                        solved: [],
                        userEmail: email,
                        score: 0,
                        submissions: 0,
                        lastSubmissionTime: null
                    };
                    rankedUser.solved.push(index);
                    rankedUser.score += (index + 1) * 50;
                    rankedUser.lastSubmissionTime = new Date();
                    rankedUser.submissions += 1;
                    contest.rankings.push(rankedUser);
                }

                if (!rankedUser.solved.includes(index)) {
                    rankedUser.solved.push(index);
                    rankedUser.score += (index + 1) * 50;
                    rankedUser.lastSubmissionTime = new Date();
                    rankedUser.submissions += 1;
                }

                console.log(rankedUser);
                await contest.save();
            }
        }

        res.send({
            success: submissionResult === "ACC",
            message,
            receivedOutput: output.trim(),
            expectedOutput
        });

    } catch (err) {
        console.error("Error executing code:", err);
        res.status(500).json({ success: false, message: "Error executing code", error: err.message });
    }
});




app.get('/submissions/:contestId/:index', async (req, res) => {
    const { contestId, index } = req.params;
    const userEmail = req.query.email; // Get userEmail from query params

    try {
        const user = await User.findOne({ email: userEmail });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const submissions = user.submissions.filter(submission => (
            submission.contestId === contestId &&
            submission.problemIndex === index
        ));

        res.json({ submissions });
    } catch (err) {
        console.error('Error fetching submissions:', err);
        res.status(500).json({ message: 'Failed to fetch submissions' });
    }
});

app.get('/:contestId/:index', async (req, res) => {
    try {
        const { contestId, index } = req.params;
        const contest = await Contest.findById(contestId);

        if (!contest) {
            return res.status(404).send('Contest not found');
        }

        const problem = contest.problems[index];

        if (!problem) {
            return res.status(404).send('Problem not found');
        }

        res.json(problem);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

//user profile
// Route to fetch user by email
app.get('/user', async (req, res) => {
    try {
        const email = req.query.email;
        const user = await User.findOne({ email }).exec();
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error('Error fetching user:', err);
        res.status(500).json({ error: err.message });
    }
});

app.put('/contests/:contestId', async (req, res) => {
    const { contestId } = req.params;
    const updatedContest = req.body;

    try {
        const contest = await Contest.findByIdAndUpdate(contestId, updatedContest, { new: true }).exec();
        if (!contest) {
            return res.status(404).json({ message: 'Contest not found' });
        }

        res.status(200).json(contest);
    } catch (err) {
        console.error('Error updating contest:', err);
        res.status(500).json({ error: err.message });
    }
});




// Route to handle profile picture upload
app.post('/uploadProfilePic', upload.single('profilePhoto'), async (req, res) => {
    try {
        console.log("called");
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Update the user's profile picture in the database
        const userEmail = req.body.userEmail; // Assuming user email is sent from frontend
        const profileImagePath = path.join('uploads/images', req.file.filename);

        let user = await User.findOne({ email: userEmail });
        if (!user) {
            console.log("user not found");
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user's profile picture field
        user.profilePicture = profileImagePath;
        await user.save();

        res.status(200).json({ message: 'Profile picture updated successfully', imagePath: profileImagePath });
    } catch (error) {
        console.error('Error uploading profile photo:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route to check user email in contest registrations and register if not present
app.post('/checksubmission', async (req, res) => {
    const { contestId, userEmail } = req.body;

    try {
        // Find contest by contestId
        const contest = await Contest.findById(contestId).exec();
        if (!contest) {
            return res.status(404).json({ message: 'Contest not found' });
        }

        // Check if userEmail exists in registrations array
        if (contest.registrations.includes(userEmail)) {
            return res.json({ message: 'User already registered for this contest' });
        }

        // If userEmail not found, append it to registrations array
        contest.registrations.push(userEmail);
        await contest.save();

        res.json({ message: 'User registered successfully for the contest' });
    } catch (err) {
        console.error('Error checking submission:', err);
        res.status(500).json({ error: err.message });
    }
});


app.listen(3000, async () => {
    console.log("Server is listening on port 3000");
    console.log("Connecting DB");
    await DBConnection();
});