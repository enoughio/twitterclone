import mongoose, { Types } from "mongoose";
import User from "./user.model";

const postSchema = mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        require: true
    },

    text : {
        type: String
    },

    img : {
        type : String
    },

    likes: [

        {
            type: mongoose.Schema.Types.ObjectId,
            ref: User,
        }
    ],

    Comment: [
        {
            text: {
                type: String,
                require: true
            },
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: User,
                require: true
            }
        }
    ]

}, { timeStamp: true })


const Post = mongoose.model("Post", postSchema);

export default Post;