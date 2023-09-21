import express from "express"
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
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

env.config()


const app = express()
const PORT = process.env.PORT || 5000




app.use(cookieParser())

app.use(express.json())

app.use('/public', express.static(path.join(__dirname, 'public')))


app.use("/api/auth",authRouter)


app.use("/api/friends",FriendRouter)

app.use('/api/user',userRouter)

app.use(errorHandler)



ConnentDB().then((data) => {
    app.listen(PORT,() => {
        console.log(data)
        console.log("server is running on PORT",PORT);
    })
})
.catch((err) => {
    console.log("server is error on PORT",err);
})

