import TryCatch from "../lib/config/AsyncHandler.js";
import { AuthenticatedRequest } from "../middlewares/isAuth.js";
import { Chat } from "../models/Chat.model.js";

 

 export const createNewChat = TryCatch(async(req: AuthenticatedRequest, res)=>{
    const userId = req.user?._id
    const { otherUserId } = req.body;

    if(!otherUserId){
        res.status(400).json({
            message: "Other userid is required!"
        });
        return
    }

    const existingChat = await Chat.findOne({
        users: {$all: [userId, otherUserId], $size: 2},  
    })

    if(existingChat){
        res.json({
            messsage: "Chat already exixst",
            chatId: existingChat?._id
        })
        return;
    }

    const newChat = await Chat.create({
        users: [userId, otherUserId]
    })


    res.status(201).json({
        message: "New Chat created",
        chatId: newChat._id
    })
 })