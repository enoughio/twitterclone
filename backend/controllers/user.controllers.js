import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";

export const getUserProfile = async (req, res) => { 
    const { username } = req.params;

    try {
        const user = await User.findOne({userName: username}).select("-password");
        if(!user) {
            return res.status(404).json({message: "User not found"});
        }
        res.status(200).json(user);
        
    } catch (error) {
        console.trace("Error in getUserProfile", error);  
        res.status(500).json({message: "Internal server error"})    
    }

} 



export const followUserProfile = async (req, res) => { 
    
    
    try {
        const { id } = req.params;  // to follow/unfollow
        const userToModify = await User.findById(id);
        const currentUser  = await User.findById(req.user._id);

        if(id === currentUser._id) {
            return res.status(400).json({message: "You can't follow yourself"});
        }

        if(!userToModify) {
            return res.status(404).json({message: "User not found"});
        }

        const isAlreadyFollow = currentUser.following.includes(id);

        if(isAlreadyFollow) {// Unfollow

            // remove follower to userToModify
            await User.findByIdAndUpdate(id, {$pull: {followers: currentUser._id}});
            // remove following to currentUser
            await User.findByIdAndUpdate(currentUser._id, {$pull: {following: id}});

            res.status(200).json({message: "Unfollowed successfully"});     
            
        }else{// Follow
            
            // add follower to userToModify
            await User.findByIdAndUpdate(id, {$push: {followers: currentUser._id}});
            // add following to currentUser
            await User.findByIdAndUpdate(currentUser._id, {$push: {following: id}});

            // Create notification
            const notification = new Notification({type : "follow", to: id, from: req.user._id});
            await notification.save();
            //TODO return the id of the user to response 
            res.status(200).json({message: "Followed successfully"});
        }
        
    } catch (error) {
        console.trace("Error in followUserProfile", error);  
        res.status(500).json({message: "Internal server error"})    
    }
    
 }