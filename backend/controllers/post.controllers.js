import { uploadImage } from "../lib/clloudImageUpload.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";

export const createPost = async (req, res) =>{

    try {        
        let { img } = req.body;
        const { text } = req.body;   

        const userId = req.user._id;
        const user = await User.findById(userId);

        if(!user){
            return res.status(404).json({
                error: "User not found"
            })
        }

        if(!img && !text){
           return res.status(400).json({
                error : "post should contain text or image"
            })
        }

        if(img){
            img = uploadImage(img, "post_image");
        }

        const post = new Post({
            user: user._id,
            img,
            text
        });

        post.save();

        res.status(200).json({
            message: "post succesfully created"
        })

    } catch (error) {
        console.trace("Error in createPost", error);
        res.status(500).json({ error: "Internal server error" })
    }
}