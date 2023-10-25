import Router from 'express'
import friendController from '../controllers/friend.controller.js'
import jwt from "jsonwebtoken";
import JwtData from "../middlewares/verify.js"
const FriendRouter= Router()
const {verifyToken}=new JwtData()
const {getAllFriend,addFriend,removeFriend,blockFriend,removeBlock}= new friendController()

FriendRouter.get('/',verifyToken,getAllFriend)
FriendRouter.post('/', verifyToken,addFriend)
FriendRouter.delete('/',verifyToken,removeFriend)
FriendRouter.post('/blocked',verifyToken,blockFriend)
FriendRouter.delete('/blocked',verifyToken,removeBlock)
export default FriendRouter

