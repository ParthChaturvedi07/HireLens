import mongoose, { Mongoose } from "mongoose";

/**
 * @description User Schema
 * @author Parth Chaturvedi
 * @date 2026-04-12
 * @version 1.0.0
 */
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: [true, "username already taken"],
        required: true
    },

    email: {
        type: String,
        unique: [true, "Account already exists wiht this email address"],
        required: true
    },

    password: {
        type: String,
        required: true
    },
})

const userModel = mongoose.model("Users", userSchema);

export default userModel;