import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";

import bcyript from "bcryptjs";
import { v2 as cloudinary } from 'cloudinary';
// import { validationResult } from "express-validator"; // Optional for validation


export const getUserProfile = async (req, res) => {
    const { username } = req.params;

    try {
        const user = await User.findOne({ userName: username }).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(user);

    } catch (error) {
        console.trace("Error in getUserProfile", error);
        res.status(500).json({ error: "Internal server error" })
    }
}


export const followUserProfile = async (req, res) => {
    try {
        const { id } = req.params;  // to follow/unfollow
        const userToModify = await User.findById(id);
        const currentUser = await User.findById(req.user._id);

        if (id === currentUser._id) {
            return res.status(400).json({ error: "You can't follow yourself" });
        }

        if (!userToModify) {
            return res.status(404).json({ error: "User not found" });
        }

        const isAlreadyFollow = currentUser.following.includes(id);

        if (isAlreadyFollow) {// Unfollow

            // remove follower to userToModify
            await User.findByIdAndUpdate(id, { $pull: { followers: currentUser._id } });
            // remove following to currentUser
            await User.findByIdAndUpdate(currentUser._id, { $pull: { following: id } });

            res.status(200).json({ message: "Unfollowed successfully" });

        } else {// Follow

            // add follower to userToModify
            await User.findByIdAndUpdate(id, { $push: { followers: currentUser._id } });
            // add following to currentUser
            await User.findByIdAndUpdate(currentUser._id, { $push: { following: id } });

            // Create notification
            const notification = new Notification({ type: "follow", to: id, from: req.user._id });
            await notification.save();
            //TODO return the id of the user to response 
            res.status(200).json({ message: "Followed successfully" });
        }

    } catch (error) {
        console.trace("Error in followUserProfile", error);
        res.status(500).json({ message: "Internal server error" })
    }
}


export const getSuggesteduser = async (req, res) => {
    try {
        const userId = req.user._id;

        const userFollowedByMe = await User.findById(userId).select("following")
        const users = await User.aggregate([
            {
                $match: {
                    _id: { $ne: userId }
                }
            },
            {
                $sample: { size: 10 }
            }
        ]);

        const curetedUser = users.filter((item) => !userFollowedByMe.following.includes(item._id))

        const suggestedUser = curetedUser.slice(0, 4);

        suggestedUser.forEach((user) => user.password = null)
        res.status(200).json(suggestedUser);


    } catch (error) {
        console.trace("Error in getSuggesteduser", error);
        res.status(500).json({ message: "Internal server error" })
    }
}





// export const updateUser = async (req, res) => {

//     const { email, userName, fullName, currentPassword, newPassword, bio, link } = req.body;
//     let { profileImage, coverImage } = req.body;
//     const userId = req.user._id;

//     let hashedPassword;
//     try {

//         if ((!newPassword && currentPassword) || (!currentPassword && newPassword))
//             return res.status(400).json({ error: "plese provide both current and new password" });


//         let user = await User.findById(userId);
//         if (!user)
//             return res.status(404).json({ error: "User not found" });

//         if (currentPassword && newPassword) {
//             const isMatch = await bcyript.compare(currentPassword, user.password);

//             if (!isMatch) {
//                 return res.status(400).json({ error: "current password is incorrect" });
//             }

//             if (newPassword < 6)
//                 return res.status(400).json({ error: "newPassword must be more then 6 letters" });

//             const salt = await bcyript.genSalt(10);
//             hashedPassword = await bcyript.hash(newPassword, salt);
//         }

//         if (profileImage) {

//             if(user.profileImage){
//                 await cloudinary.uploader.destroy(user.profileImage.slice('/').pop().split(".")[0]);
//             }

//             // Upload an image
//             const uploadResult = await cloudinary.uploader
//                 .upload(
//                     profileImage
//                 //     , {
//                 //     public_id: 'profileImage',
//                 // }
//                 )
//                 .catch((error) => {
//                     throw new Error("can not upload profile image");
//                 });

//                 profileImage = uploadResult.secure_url;
//         }

//         if (coverImage) {

//             if(user.coverImage){
//                 await cloudinary.uploader.destroy(user.coverImage.slice('/').pop().split(".")[0]);
//             }

//             const uploadResult = await cloudinary.uploader
//                 .upload(
//                     coverImage
//                 //     , {
//                 //     public_id: 'coverImage',
//                 // }
//                 )
//                 .catch((error) => {
//                     throw new Error("can not upload cover image");
//                 });

//                 coverImage = uploadResult.secure_url;
//         }


//         user.fullName = fullName || user.fullName;
//         user.email = email || user.email;
//         user.bio = bio || user.bio;
//         user.link = link || user.link;
//         user.profileImage = profileImage || user.profileImage;
//         user.coverImage = coverImage || user.coverImage;
//         user.password = hashedPassword || user.password;
        
//         user = await user.save();

        


//     } catch (error) {
//         console.trace("Error in updateUser", error);
//         res.status(500).json({ message: "Internal server error" })
//     }

// }



// Helper function to upload images to Cloudinary


const uploadImage = async (image, folderName) => {
    const timestamp = Math.floor(Date.now() / 1000);
    const publicId = `${folderName}/${timestamp}`;

    try {
        const uploadResult = await cloudinary.uploader.upload(image, {
            public_id: publicId,
            folder: folderName,
        });
        return uploadResult.secure_url;
    } catch (error) {
        throw new Error(`Error uploading ${folderName} image: ${error.message}`);
    }
};

// Helper function to delete Cloudinary images
const deleteCloudinaryImage = async (imageUrl) => {
    try {
        const publicId = imageUrl.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error(`Error deleting Cloudinary image: ${error.message}`);
    }
};

export const updateUser = async (req, res) => {
    const { email, userName, fullName, currentPassword, newPassword, bio, link } = req.body;
    let { profileImage, coverImage } = req.body;

    try {
        // Validate request body
        if ((!newPassword && currentPassword) || (!currentPassword && newPassword)) {
            return res.status(400).json({ error: "Provide both current and new password." });
        }

        // Fetch user from database
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ error: "User not found." });

        // Handle password update
        let hashedPassword = user.password;
        if (currentPassword && newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) return res.status(400).json({ error: "Current password is incorrect." });

            if (newPassword.length < 6)
                return res.status(400).json({ error: "New password must be at least 6 characters." });

            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(newPassword, salt);
        }

        // Handle profile image upload
        if (profileImage) {
            if (user.profileImage) await deleteCloudinaryImage(user.profileImage);
            profileImage = await uploadImage(profileImage, "profile_images");
        }

        // Handle cover image upload
        if (coverImage) {
            if (user.coverImage) await deleteCloudinaryImage(user.coverImage);
            coverImage = await uploadImage(coverImage, "cover_images");
        }

        // Update user fields
        user.fullName = fullName || user.fullName;
        user.email = email || user.email;
        user.bio = bio || user.bio;
        user.link = link || user.link;
        user.profileImage = profileImage || user.profileImage;
        user.coverImage = coverImage || user.coverImage;
        user.password = hashedPassword;

        // Save updated user to database
        const updatedUser = await user.save();

        // Respond with updated user data
        res.status(200).json({ message: "User updated successfully.", user: updatedUser });
    } catch (error) {
        console.error("Error in updateUser:", error);
        res.status(500).json({ error: "Internal server error. Please try again later." });
    }
};
