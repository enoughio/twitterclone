import { uploadImage } from "../lib/clloudImageUpload.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";

export const getAllPost = async (req, res) => {

    try {
        const posts = await Post.find().sort({createdAt: -1}).populate({
            path: 'user',
            select: '-password'
        }).populate({
            path : "comments.user",
            select: "-password"
        })

        if(posts.length == 0){
            return res.status(200).json([]);
        }
        return res.status(200).json(posts);

    } catch (error) {
        console.trace("Error in createPost", error);
        res.status(500).json({ error: "Internal server error" })
    }

}


export const getUserPost = async (req, res) => {
    try {
        const { userName } = req.params;

        const user = await User.findOne({ userName })
        // if(!user)
        //     return res.status(404).json({error : "user not found"});

        const userPost = await Post.find({user : user._id}).sort({ createdAt: -1}).populate({
            path: "user",
            select: "-password"
        }).populate({
            path: "comments.user",
            select: "-password",
        })


            return res.status(200).json(userPost);

    } catch (error) {
        
        console.log("error in getUserPost", error);
        return res.status(500).json({
            error: "intetrnal server error"
        })

    }
}

export const createPost = async (req, res) => {

    try {
        let { img } = req.body;
        const { text } = req.body;

        const userId = req.user._id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                error: "User not found"
            })
        }

        if (!img && !text) {
            return res.status(400).json({
                error: "post should contain text or image"
            })
        }

        if (img) {
            img = uploadImage(img, "post_image");
        }

        const post = new Post({
            user: user._id,
            img,
            text
        });

        await post.save();
        console.log("Post created", post);
        res.status(200).json({
            message: "post succesfully created",
            post: post
        })

    } catch (error) {
        console.trace("Error in createPost", error);
        res.status(500).json({ error: "Internal server error" })
    }
}

export const deletePost = async (req, res) => {

    try {
        const userId = req.user._id;
        // console.log(req.params.id)
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                error: "post not found"
            })
        }

        if (post.user.toString() !== userId.toString()) {
            return res.status(400).json({
                error: "you are not authorized to delete this psot"
            })
        }

        if (post.img) {
            try {
                const public_id = post.img.split('/').pop().split('.')[0];
                await cloudnary.uploader.destroy(public_id);
            } catch (error) {
                console.error(`Error deleting Cloudinary image: ${error.message}`);
                return res.status(500).json({ error: "can not delete post " })
            }
        }

        await Post.findByIdAndDelete(req.params.id);
        console.log("post deleted succesfully", req.params.id);;
        return res.status(200).json({
            message: "post deleted succesfully"
        })

    } catch (error) {
        console.trace("Error in delete Post", error);
        res.status(500).json({ error: "Internal server error" })
    }
};

export const commetOnPost = async (req, res) => {

    try {
        const postId = req.params.id;
        const { text } = req.body;
        const userId = req.user._id;

        if(!text)
            return res.status(400).json({ error:  "text not found"})

        const user = await User.findById(userId);
        if(!user)
            return res.status(400).json({error : "user not authenticated"})

        const post = await Post.findById(postId);
        if(!post)
            return res.status(400).json({ error : "post not found"})

        const comment = { user : userId, text}; 
        post.comments.push(comment);
        await post.save();

        return res.status(200).json({message: "Comment added succesfully",
            post: post
        });

    } catch (error) {
        console.trace("Error in commetPostRoute", error);
        res.status(500).json({ error: "Internal server error" })
    }
}

export const likeUnlikePost = async (req, res) => {

    try {
        const userId = req.user._id;
        const postId = req.params.id;

        const user = await User.findById(userId); 
        if(!user){
            return res.status(404).json({
                error: "Unauthorized user"
            })
            // res.redirect('/auth/login')
        }

        const post = await Post.findById(postId);
        if(!post){
            return res.status(404).json({
                error: "Post not found"
            })
        }

        const isLikedPost = await post.likes.includes(userId);        
        
        if(isLikedPost){
            
            await Post.updateOne(
                {_id: postId}, {$pull : {likes: userId}} 
            );
            await User.updateOne(
                {_id: userId}, {$pull : {likedPost: postId}} 
            );

            return res.status(200).json({
                message : "post Undliked"
            })

        } else {
            post.likes.push(userId);
            user.likedPost.push(userId);
            const notification = new Notification({
                from: userId,
                to: post.user,
                type: "like"
            });

            await User.updateOne(
                {_id: userId}, {$push : {likedPost: postId}} 
            );

            await post.save();
            await notification.save();
            return res.status(200).json({
                message : "post liked"
            })
        }

    } catch (error) {
        console.trace("Error in LikeUnlikePost", error);
        res.status(500).json({ error: "Internal server error" })
    }
}

export const getLikedPost = async (req, res) => {
    try {
        
        const userId = req.params.id;
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({
                error: "User not found"
            })
        }
        const likedPost = await Post.find({_id : {$in : user.likedPost } }).populate({
            path: "user",
            select: "-password"
        }).populate({
            path : "comments.user",
            select: "-password" 
        })

        return res.status(200).json(likedPost);

    } catch (error) {
        console.trace("Error in getLikedPost", error);
        res.status(500).json({ error: "Internal server error" })
    }
}

export const getFollowedPost = async (req, res) => {
    try {
        
        const userId = req.user._id;
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({
                error: "User not found"
            })
        }

        const following = user.following;

        const feedPost = await Post.find({user : {$in : following } }).sort({createdAt: -1}).populate({
            path: "user",
            select: "-password"
        }).populate({
            path: "comments.user",
            select: "-password"
        })

        return res.status(200).json(feedPost);

    } catch (error) {
        console.trace("Error in getFollowedPost", error);
        res.status(500).json({ error: "Internal server error" })    
    }
}


export const login = async (req, res) => {
    try {
        const { userName, password } = req.body;
        if (!userName || !password) {
            return res.status(400).json({ error: "please fill all the fields" });
        }

        const user = await User.findOne({ userName: userName });
        if (!user) {
            return res.status(400).json({ error: "Invalid username or password" });
        }

        const isvalidPassword = await bcrypt.compare(password, user.password);
        if (!isvalidPassword) {
            return res.status(400).json({ error: "Invalid username or password" });
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
        });

    } catch (error) {
        console.trace(error, "error in login controller");
        res.status(500).json({ error: error.message });
    }
};

