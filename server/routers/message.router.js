import Router from 'express'
import MessageController from '../controllers/message.controller.js'
import JwtData from "../middlewares/verify.js"

const messageRouter= Router()
const {verifyToken}=new JwtData()
const {addMessage,deleteMessageOne,deleteMessageBoth,deleteConservation}= new MessageController()
 messageRouter.post('/add',verifyToken,addMessage)
 messageRouter.delete('/deleteOne/:id',verifyToken,deleteMessageOne)
 messageRouter.delete('/deleteBoth/:id',verifyToken,deleteMessageBoth)
messageRouter.delete('/deleteConversation/:idRoom',verifyToken,deleteConservation)

export default messageRouter