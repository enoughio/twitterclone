import mongoose, { Schema } from "mongoose";

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

    userName : {
        type: String,
        required: true,
        trim: true,
        unique: true    
    },


    followers: [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref: "User",
            default : []
        }
    ],

    following: [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref: "User",
            default : []
        }
    ],

    profileImage : {
        type: String,
        default : ""
    },

    coverImage : {
        type: String,
        default : ""
    },

    bio : {
        type: String,
        default : ""
    },

    link : {
        type: String,
        default : ""
    },



    // isVerified: {
    //     type: Boolean,
    //     default: false
    // },

    // resetPasswordToken : String,
    // resetPasswordExpiresAt: Date,   //after 1 hour
    // verificationToken: String,
    // verificationTokenExpiresAt: Date  //after 6 hour

}, { timestamps: true }); 


const User = mongoose.model("User", userSchema); //creating a model from the schema
export default  User;

