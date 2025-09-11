import express from 'express'
import { createNewChat, getAllChats, sendMessage } from '../controllers/chat.controller.js';
import { isAuth } from '../middlewares/isAuth.js';
import { upload } from '../middlewares/multer.js';

const router = express.Router();

router.post("/chat/new", isAuth, createNewChat)
router.get("/chat/all", isAuth, getAllChats)
router.get("/message", isAuth, upload.single('image'), sendMessage )


export default router 