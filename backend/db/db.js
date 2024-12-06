import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: '.././.env' });

const MONGOOSE_URL = process.env.MONGOOSE_URL;

// Define a function for connecting to the database
const connectDB = async () => {
    try {
        await mongoose.connect(MONGOOSE_URL);
        console.log('Database Connected');
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1); // Exit if there's a connection error
    }
};

// Call connectDB when the script runs
connectDB();

const Schema = mongoose.Schema;

// Define User Schema
const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true }
});

// Define Mentor Schema
const mentorSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    secretKey: { type: String, unique: true, required: true }
});

// Create Models for both User and Mentor
const UserModel = mongoose.model('User', userSchema);
const MentorModel = mongoose.model('Mentor', mentorSchema);

export default {
    UserModel,
    MentorModel
};
