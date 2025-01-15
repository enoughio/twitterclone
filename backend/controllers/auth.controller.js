import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { link } from "fs";
import { error } from "console";
import { generateTokenAndSetCookie } from "../lib/generateToken.js";

export const signup = async (req, res) => {
    res.json({ message: "signup route" })

    try {
        const { fullName, userName, email, password } = req.body;

        if (!fullName || !userName || !email || !password) {
            throw new Error("All fields are required")
        }


        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if (!emailRegex.test(email)) {
            throw new Error("Invalid email")
        }

        const existingUser = await User.findOne({ userName : userName });
        if(existingUser) {
            throw new Error("Username already exists")
        }

        const existEmail = await User.findOne({ email : email });
        if(existEmail) {
            throw new Error("Email already exists")
        }

        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);


        const newUser = new User({
            fullName,
            userName,
            email,
            password : hashedPassword
        })


        if(newUser) {
            generateTokenAndSetCookie(newUser._id, res);
            await newUser.save();
            res.status(201).json({ 
                _id : newUser._id,
                fullName : newUser.fullName,
                userName : newUser.userName,   
                email : newUser.email,
                followers : newUser.followers,
                following : newUser.following,
                profileImage : newUser.profileImage,
                coverImage : newUser.coverImage,
                // bio : newUser.bio,
                // link : newUser.link
             })
        }else{
            res.status(400).json({ error : "User not created" })
        }

    } catch (error) {

        console.trace(error, "error in signup controller");
        res.status(500).json({ error : error.message })

    }
}

export const signin = (req, res) => {
    res.json({ message: "signin route" })
}


export const logout = (req, res) => {
    res.json({ message: "signout route" })
}