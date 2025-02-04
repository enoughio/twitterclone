import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Use model name as a string
        required: true, 
    },

    text: {
        type: String
    },

    img: {
        type: String
    },

    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Use model name as a string
        }
    ],

    comments: [
        {
            text: {
                type: String,
                required: true 
            },
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User", // Use model name as a string
                required: true 
            }
        }
    ]

}, { timestamps: true }); // (timestamps)

const Post = mongoose.model("Post", postSchema);

export default Post;
