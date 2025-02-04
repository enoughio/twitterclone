import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({ 

    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Use string for model reference
        required: true
    },
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Use string for model reference
        required: true
    },

    read: {
        type: Boolean,
        default: false
    },

    type: {
        type: String,
        required: true,
        enum: ["follow", "like"] // Consider expanding this if needed
    }

}, { timestamps: true });

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
