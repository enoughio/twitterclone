import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },

    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6
    },

    fullName: {
        type: String,
        required: true,
        trim: true
    },

    userName: {
        type: String,
        required: true,
        trim: true,
        unique: true    
    },

    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User" // Use model name as a string
        }
    ],

    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User" // Use model name as a string
        }
    ],

    profileImage: {
        type: String,
        default: ""
    },

    coverImage: {
        type: String,
        default: ""
    },

    bio: {
        type: String,
        default: ""
    },

    link: {
        type: String,
        default: ""
    },

    likedPost: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post" // Use model name as a string
        }
    ]

}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;
