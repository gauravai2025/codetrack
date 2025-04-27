const mongoose = require('mongoose');

const submissionSchema = mongoose.Schema({
    contestId: { type: String, required: true },
    submissionType: { type: String, required: true },
    problemIndex: { type: String, required: true },
    code: { type: String, required: true },
    dateTime: { type: Date, default: Date.now },
    result: { type: String, required: true },
    message: { type: String, required: true },
    receivedOutput: { type: String, required: true },
    expectedOutput: { type: String, required: true }
});

const userSchema = mongoose.Schema({
    username: { type: String, unique: true, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    adminRole: { type: Boolean, default: false },
    contests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contest' }],
    submissions: [submissionSchema],
    profilePicture: { type: String, default: 'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg' }
});

module.exports = mongoose.model('User', userSchema);
