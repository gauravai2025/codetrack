const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const DBConnection = async () => {
    const MONGODB_URL = process.env.MONGODB_URL;
    try {
        console.log("conneccting....");
        await mongoose.connect(MONGODB_URL, { useNewUrlParser: true });
        console.log("Connected to DB");
    }
    catch (err) {
        console.log("Error connecting to DB: ", err);

    }
}
module.exports = { DBConnection };