import Notification from "../models/notification.model.js";


export const getNotifications = async (req, res) => {

    try {
        const userId = req.user;
        
        const notifiaction = await Notification.find({ to : userId}).sort({createdAt : -1}).populate({
            path:  "from",
            select: { userName: 1, profileImage: 1 },  /// new way to select data
        })

        await Notification.updateMany({to : userId}, {read: true});
        return res.status(200).json(notifiaction);

    } catch (error) {
        console.log("error in getNotification route", error);
        return res.status(500).json({
            error:  "Internal server error"
        })
    }
}


export const deleteNotifications = async (req, res) => {
    try {
        
        const userId = req.user;
        
        const notifiaction = await Notification.deleteMany({ to : userId});

        return res.status(200).json({ message: "Notification deleted succesfully"});

    } catch (error) {
        console.log("error in deleteNotification route", error);
        return res.status(500).json({
            error:  "Internal server error"
        })
    }


}