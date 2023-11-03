import Router from 'express'
import MessageController from '../controllers/message.controller.js'
import JwtData from "../middlewares/verify.js"

const messageRouter= Router()
const {verifyToken}=new JwtData()
const {addMessage,deleteMessageOne,deleteMessageBoth,deleteConservation,checkIdSend,getMessage,checkRoom}= new MessageController()
 messageRouter.get('/room/:idRoom',verifyToken,checkRoom,getMessage)
 messageRouter.post('/room/:idRoom',verifyToken,checkRoom,addMessage)
 messageRouter.delete('/room/:idRoom/hidden',verifyToken,checkRoom,deleteMessageOne)
 messageRouter.delete('/room/:idRoom',verifyToken,checkRoom,checkIdSend,deleteMessageBoth)
messageRouter.delete('/room/:idRoom/deleteConversation',verifyToken,checkRoom,deleteConservation)

export default messageRouter