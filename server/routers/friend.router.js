import Router from 'express'
import friendController from '../controllers/friend.controller.js'
import jwt from "jsonwebtoken";
import JwtData from "../middlewares/verify.js"
const FriendRouter= Router()
const {verifyToken}=new JwtData()
const {getAllFriend,addFriend,removeFriend}= new friendController()

FriendRouter.get('/list',verifyToken,getAllFriend)
FriendRouter.post('/add', verifyToken,addFriend)
FriendRouter.post('/remove',verifyToken,removeFriend)
FriendRouter.post('/block',verifyToken)

export default FriendRouter

