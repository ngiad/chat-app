import { Router } from "express"
import AuthController from "../controllers/auth.controller.js"


const authRouter = Router()

const { register } = new AuthController()
authRouter.post("/login",)
authRouter.post("/register",register)
authRouter.get("/refresh",)
authRouter.post('/forgot')
authRouter.put('/update')


export default authRouter