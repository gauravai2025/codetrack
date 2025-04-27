// models/Contest.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define schema for Problem
const problemSchema = new Schema({
    name: { type: String },
    description: { type: String },
    constraints: { type: String },
    complexity: { type: String },
    testCases: { type: String },
    expectedOutputs: { type: String },
    inputFile: { type: String },
    outputFile: { type: String },
    images: [{ type: String }], // Assuming images are stored as URLs
});

// Define schema for Contest
const contestSchema = new Schema({
    contestName: { type: String },
    duration: { type: String },
    startTime: { type: Date },
    endTime: { type: Date },
    photo: { type: String },
    problems: [problemSchema], // Array of Problem schema
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', },
    registrations: [{ type: String }],
    rankings: [{
        solved: [{ type: Number }],
        userEmail: { type: String },
        score: { type: Number },
        submissions: { type: Number },
        lastSubmissionTime: { type: Date }
    }],
});

const Contest = mongoose.model('Contest', contestSchema);

module.exports = Contest;
