import express from "express"
import { Server } from 'socket.io';
import { createServer } from 'node:http';
import cors from "cors"
import env from "dotenv"
import path from "path"
import { fileURLToPath } from 'url'
import ConnentDB from "./utils/mongoose.init.js"
import { errorHandler } from "./middlewares/handle.error.js"
import authRouter from "./routers/auth.router.js"
import cookieParser from "cookie-parser"
import FriendRouter from './routers/friend.router.js'
import userRouter from "./routers/user.router.js"
import roomRouter from "./routers/room.router.js"
import messageRouter from "./routers/message.router.js"
import  CheckAuthSocket from './middlewares/checkAuthSocket.js'
import jwt from 'jsonwebtoken'
import modelUser from './models/user.model.js'
import modelRoom from './models/room.model.js'
import messageModel from "./models/message.model.js";
import mongoose from "mongoose";
import MessageSerVice from './services/message.service.js'
// const blackListToken=[1];
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const messageSerVice= new MessageSerVice()



env.config()


const app = express()
const PORT = process.env.PORT || 5000
const server = createServer(app);
const io = new Server(server);

global.blackListToken =[]

app.use(cookieParser())

app.use(express.json())

app.use('/public', express.static(path.join(__dirname, 'public')))



app.use(cors({
    origin:"*"
}))

app.use("/api/auth",authRouter)


app.use("/api/friends",FriendRouter)

app.use('/api/user',userRouter)

app.use('/api/rooms',roomRouter)

app.use('/api/messages',messageRouter)

app.use(errorHandler)
app.get('/',(req,res)=>{
     res.sendFile(path.join(__dirname,'../FE/html/home.html'))
    
})
app.get('/login',(req,res)=>{
    res.sendFile(path.join(__dirname,'../FE/html/login.html'))
})







io.use(function(socket, next){
  
    if (socket.handshake.query && socket.handshake.query.token){
      
      jwt.verify(socket.handshake.query.token, 'taotoken',async function(err, decoded) {
        if (err) return next(new Error('Authentication error'));
        let user = await modelUser.findOne({_id:decoded.id})  
        let room = await modelRoom.find({userRoom:{$in:[new mongoose.Types.ObjectId(decoded.id)]}})
        socket.user = user;
        socket.room=room
        next();
      });
    }
    else {
      next(new Error('Authentication error'));
    }    
  })
  .on('connection', function(socket) {
    console.log('1 socket vao hang ===',socket.id);
    socket.on('disconnect',()=>{
      console.log('a user disconnect');
  })
    socket.room.forEach(item => {
      let room= item._id.toHexString()
      socket.join(room)
    });
      socket.on('chat message',async function(message,idRoom) {
         io.to(idRoom).emit('chat message',message)
         const addMessage= await messageSerVice.addMessage(idRoom,message,socket.user._id)
      })
  });




ConnentDB().then((data) => {
    server.listen(PORT,() => {
        console.log(data)
        console.log("server is running on PORT",PORT);
    })
})
.catch((err) => {
    console.log("server is error on PORT",err);
})

