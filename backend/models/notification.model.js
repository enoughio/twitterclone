import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({ 

    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    from :{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    type: {
        type: String,
        required: true,
        enum: ["follow", "like"]
    },

}, { timestamps: true });


const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;