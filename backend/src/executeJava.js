const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const currDir = __dirname;
const outputPath = path.join(currDir, "outputs");

if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
}

const executeJava = (filePath, inputFilePath) => {
    const jobId = path.basename(filePath).split(".")[0];
    const tempInputFilePath = path.join(outputPath, `${jobId}_input.txt`);

    return new Promise((resolve, reject) => {
        // Read the input file
        fs.readFile(inputFilePath, 'utf8', (readError, inputData) => {
            if (readError) {
                return reject(readError);
            }

            // Write input data to a temporary file
            fs.writeFile(tempInputFilePath, inputData, (writeError) => {
                if (writeError) {
                    return reject(writeError);
                }

                const dir = path.dirname(filePath);
                const compileCommand = `javac "${filePath}"`;

                // Compile the Java file
                exec(compileCommand, (compileError, stdout, stderr) => {
                    if (compileError) {
                        // Cleanup temporary input file on error
                        fs.unlink(tempInputFilePath, (unlinkError) => {
                            if (unlinkError) {
                                console.error("Error cleaning up temp input file:", unlinkError);
                            }
                        });
                        return reject(compileError);
                    }
                    if (stderr) {
                        // Cleanup temporary input file on error
                        fs.unlink(tempInputFilePath, (unlinkError) => {
                            if (unlinkError) {
                                console.error("Error cleaning up temp input file:", unlinkError);
                            }
                        });
                        return reject(stderr);
                    }

                    const className = path.basename(filePath, '.java');
                    const command = `java -cp "${dir}" ${className} < "${tempInputFilePath}"`;
                    console.log("command: ", command);

                    // Execute the compiled Java code with input
                    exec(command, (runError, runStdout, runStderr) => {
                        // Cleanup temporary input file
                        fs.unlink(tempInputFilePath, (unlinkError) => {
                            if (unlinkError) {
                                console.error("Error cleaning up temp input file:", unlinkError);
                            }
                        });

                        if (runError) {
                            return reject(runError);
                        }
                        if (runStderr) {
                            return reject(runStderr);
                        }
                        resolve(runStdout);
                    });
                });
            });
        });
    });
};

module.exports = executeJava;
