import { Router } from "express"
import AuthController from "../controllers/auth.controller.js"


const authRouter = Router()

const { register,emailAuthen } = new AuthController()
authRouter.post("/login",)
authRouter.post("/register",register)
authRouter.get("/refresh",)
authRouter.post('/forgot')
authRouter.put('/update')
authRouter.get('/verify/:id',emailAuthen)


export default authRouter