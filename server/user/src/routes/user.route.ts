import express from 'express'
import { getAllUsers, getAUser, loginUser, myProfile, updateProfile, verifyUser } from '../controllers/user.controller.js';
import { isAuth } from '../middleware/isAuth.js';

const router = express.Router();

router.post("/login", loginUser)
router.post("/verify", verifyUser)
router.get("/me",  isAuth, myProfile )
router.get("/users",  isAuth, getAllUsers )
router.get("/user:id",  isAuth, getAUser )
router.post("/update/user",  isAuth, updateProfile )

export default router