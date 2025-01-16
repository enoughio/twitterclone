import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {

    try {

        // const token = res.cookies.jwt;
         const token = req.cookies.jwt; // Correct way to access cookies
        if (!token) {
            throw new Error("No token provided");
        }
        // console.log("token in protectRoute middleware", token);


        // verify token
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        if (!decode) {
            throw new Error("User not authenticated")
        }

        // get user from db
        const user = await User.findById(decode.id).select("-password");
        console.log("User fetched in protectRoute middleware:", user); // Add this line
        if (!user) {
            throw new Error("User not found in protectRoute");
        }
        req.user = user; 
        next();

    } catch (error) {

        console.trace(error, "error in protectRoute middleware");
        res.status(401).json({ error: error.message })

    }


}
