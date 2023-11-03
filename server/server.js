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
// const blackListToken=[1];
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);




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
      jwt.verify(socket.handshake.query.token, 'SECRET_KEY', function(err, decoded) {
        if (err) return next(new Error('Authentication error'));
        console.log(socket.decoded);
        socket.decoded = decoded;
        next();
      });
    }
    else {
      next(new Error('Authentication error'));
    }    
  })
  .on('connection', function(socket) {
      // Connection now authenticated to receive further events
     console.log('oki ạ');
      socket.on('message', function(message) {
          io.emit('message', message);
      });
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

