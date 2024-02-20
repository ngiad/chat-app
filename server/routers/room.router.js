import Router from 'express'
import RoomController from '../controllers/room.controller.js';
import jwt from "jsonwebtoken";
import JwtData from "../middlewares/verify.js"


const roomRouter = Router()

const {verifyToken,verifyTokenTokenAdmin}= new JwtData()
const  {createRoom}= new RoomController()

roomRouter.post('/',verifyToken,createRoom)




export default roomRouter