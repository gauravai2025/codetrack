const mongoose = require('mongoose');
const { DBConnection } = require('./database/db');
const Contest = require("./models/Contest");

async function migrateContests() {
    try {
        // Connect to MongoDB
        await DBConnection();

        // Fetch all contests
        const contests = await Contest.find();

        for (const contest of contests) {
            // Check if rankings need to be updated with the new structure
            let updated = false;

            contest.rankings = contest.rankings.map(ranking => {
                if (typeof ranking === 'string') {
                    // Convert old string format to new object format
                    updated = true;
                    return {
                        userEmail: ranking,
                        score: 0,
                        submissions: 0,
                        lastSubmissionTime: null,
                        solved: []
                    };
                } else if (!ranking.solved) {
                    // Add the solved field if it doesn't exist
                    updated = true;
                    return {
                        ...ranking,
                        solved: []
                    };
                }
                return ranking;
            });

            // Save the updated contest if any changes were made
            if (updated) {
                await contest.save();
            }
        }

        console.log('Contests updated with the new rankings structure');
    } catch (error) {
        console.error('Error updating contests:', error);
    } finally {
        await mongoose.disconnect();
    }
}

migrateContests();
