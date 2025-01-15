import mongoose from "mongoose";

const connectMongoDb = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI);
        console.log(`connected to data base` +connect.connection.host);
    } catch (error) {
        console.error(`error connecting to mongoDb ${error.message}`);
        process.exit(1);
    }
}


export default connectMongoDb;