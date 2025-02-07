import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { generateTokenAndSetCookie } from "../lib/generateToken.js";

export const signup = async (req, res) => {
    try {
        const { fullName, userName, email, password } = req.body;

        if (!fullName || !userName || !email || !password) {
            return res.status(400).json({ error: "please fill all the fields" })
        }


        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email" })
        }

        const existingUser = await User.findOne({ userName: userName });
        if (existingUser) {
            return res.status(400).json({ error: "Username already exists" })   
        }

        const existEmail = await User.findOne({ email: email });
        if (existEmail) {
            return res.status(400).json({ error: "Email already exists" })
        }

        if (password.length < 6) {
            return  res.status(400).json({ error: "Password must be atleast 6 characters" })
        }

        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);


        const newUser = new User({
            fullName,
            userName,
            email,
            password: hashedPassword
        })
        

        if (newUser) {
            generateTokenAndSetCookie(newUser._id, res);
            await newUser.save();
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                userName: newUser.userName,
                email: newUser.email,
                followers: newUser.followers,
                following: newUser.following,
                profileImage: newUser.profileImage,
                coverImage: newUser.coverImage,
                // bio : newUser.bio,
                // link : newUser.link
            })

        } else {
            res.status(400).json({ error: "User not created" })
        }
        console.log("User created successfully");

    } catch (error) {

        console.trace(error, "error in signup controller");
        res.status(500).json({ error: error.message })

    }
}



export const login = async (req, res) => {
    try {
        const { userName, password } = req.body;
        if(!userName || !password){
            return res.status(400).json({error: "please fill all the fields"})
        }

        const user = await User.findOne({ userName: userName });
        if(!user)
            return res.status(400).json({error: "User not found"})
        const isvalidPassword = await bcrypt.compare(
            password,
            user.password
        )

        if(!user || !isvalidPassword){
            return res.status(400).json({error: "Invalid username or password"})
        }

        generateTokenAndSetCookie(user._id, res);   
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            userName: user.userName,
            email: user.email,
            followers: user.followers,
            following: user.following,
            profileImage: user.profileImage,
            coverImage: user.coverImage,
        })

    } catch (error) {
        console.trace(error, "error in logoin controller");
        res.status(500).json({ error: error.message })
    }

}



export const logout = async (req, res) => {

    try {

        // const { userName, password } = req.body;
        // const user = await User.findOne({ userName: userName });
        // const isvalidPassword = await bcrypt.compare(
        //     password,
        //     user.password
        // )
        // if (user || isvalidPassword) {
        // res.cookie("jwt", "", {maxAge: 0});
        // }
            res.clearCookie("jwt");
            res.json({ message: "User logged out succesfully" })

    } catch (error) {
        console.trace(error, "error in logout controller");
        res.status(500).json({ error: error.message })
    }

}




export const getMe = async (req, res) => {

    try {
        const userId = req.user;
        console.log("Received req.user in getMe:", req.user);
        const user = await User.findById(userId).select("-password");

        if(!user){
            return res.status(404).json({error: "User not found" })
        }       
        res.status(200).json(user)
 

    } catch (error) {
        console.trace(error, "error in getMe controller");
        res.status(500).json({ error: error.message })
    }

}

