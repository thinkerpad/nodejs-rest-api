const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: '.env' });

const DB_URI = process.env.DB_URI;

const connectToDatabase = async () => {
    try {
        await mongoose.connect(DB_URI);
        console.log('Connected to database successfully');
    } catch (error) {
        console.error('Error connecting to database: ', error);
        process.exit(1);
    }
};

module.exports = connectToDatabase;
