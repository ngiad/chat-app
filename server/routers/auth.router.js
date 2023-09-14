import { Router } from "express"
import AuthController from "../controllers/auth.controller.js"


const authRouter = Router()

const { register,emailAuthen,login,forgot } = new AuthController()
authRouter.post("/login",login)
authRouter.post("/register",register)
authRouter.get("/refresh",)
authRouter.post('/forgot',forgot)
authRouter.put('/update')
authRouter.get('/verify/:id',emailAuthen)
authRouter.get('/forgot/verify/:id',)


export default authRouter