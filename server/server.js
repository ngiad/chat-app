import express from "express"
import cors from "cors"
import env from "dotenv"
import path from "path"
import { fileURLToPath } from 'url'
import ConnentDB from "./utils/mongoose.init.js"



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

env.config()


const app = express()
const PORT = process.env.PORT || 5000




app.use(express.json())

app.use('/public', express.static(path.join(__dirname, 'public')))




ConnentDB().then((data) => {
    app.listen(PORT,() => {
        console.log(data)
        console.log("server is running on PORT",PORT);
    })
})
.catch((err) => {
    console.log("server is error on PORT",err);
})

