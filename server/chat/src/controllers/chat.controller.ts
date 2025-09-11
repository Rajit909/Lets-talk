import axios from "axios";
import TryCatch from "../lib/config/AsyncHandler.js";
import { AuthenticatedRequest } from "../middlewares/isAuth.js";
import { Chat } from "../models/Chat.model.js";
import { Messages } from "../models/Message.model.js";
import SendmailTransport from "nodemailer/lib/sendmail-transport/index.js";



/**
 * Create new chat
 * 
 */
export const createNewChat = TryCatch(async (req: AuthenticatedRequest, res) => {
    const userId = req.user?._id
    const { otherUserId } = req.body;

    if (!otherUserId) {
        res.status(400).json({
            message: "Other userid is required!"
        });
        return
    }

    const existingChat = await Chat.findOne({
        users: { $all: [userId, otherUserId], $size: 2 },
    })

    if (existingChat) {
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



/**
 * get all chats
 */
export const getAllChats = TryCatch(async (req: AuthenticatedRequest, res) => {
    const userId = req.user?._id;
    if (!userId) {
        res.status(400).json({
            message: "UserId missing"
        })
        return;
    }

    const chats = await Chat.find({ users: userId }).sort({ updatedAt: -1 });

    const chatWithUserData = await Promise.all(
        chats.map(async (chat) => {
            const otherUserId = chat.users.find((id) => id !== userId);
            const unseenCount = await Messages.countDocuments({
                chatId: chat._id,
                sender: { $ne: userId },
                seen: false
            });

            try {
                const { data } = await axios.get(`${process.env.USER_SERVICE}/api/user/${otherUserId}`)
                return {
                    user: data,
                    chat: {
                        ...chat.toObject(),
                        latestMessage: chat.latestMessage || null,
                        unseenCount
                    }
                }
            } catch (error) {
                console.log(error)
                return {
                    user: { _id: otherUserId, name: "Unknown User" },
                    chat: {
                        ...chat.toObject(),
                        latestMessage: chat.latestMessage || null,
                        unseenCount
                    }
                }
            }
        })
    )
    res.json({
        chats: chatWithUserData
    })
})


/**
 * send message
 */
export const sendMessage = TryCatch(async (req: AuthenticatedRequest, res)=>{
    const senderId = req.user?._id;
    const { chatId, text} = req.body;
    const imageFile = req.file

    if(!senderId){
        res.status(401).json({
            message:"Unauthorized"
        })
        return
    }
    if(!chatId){
        res.status(401).json({
            message:"chatId required"
        })
        return
    }
    if(!text && !imageFile){
        res.status(401).json({
            message:"chatId required"
        })
        return
    }


    const chat = await Chat.findById(chatId);

    if(!chat){
        res.status(404).json({
            message: "Chat not found"
        })
        return
    }
})