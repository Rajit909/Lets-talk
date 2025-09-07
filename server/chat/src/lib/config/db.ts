import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const connectDb = async () => {
    const url = process.env.MONGO_URl;

    console.log("url", url)
    
    if(!url){
        throw new Error("MONGO_URI is not defined in enviroment variables") 
    }
    try {
        await mongoose.connect(url, {
            dbName: "LetsTalk",
        });
        console.log("Connected to mongo")
    } catch (error) {
        console.error("Failed to connect to Mongodb", error);
        process.exit(1);
    }
};

export default connectDb;