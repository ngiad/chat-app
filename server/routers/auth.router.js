import { Router } from "express"
import AuthController from "../controllers/auth.controller.js"


const authRouter = Router()

const { register,emailAuthen,login,forgot,emailAuthenForgot ,refreshToken, changePassword} = new AuthController()
authRouter.post("/login",login)
authRouter.post("/register",register)
authRouter.post("/refresh",refreshToken)
authRouter.post('/forgot',forgot)
authRouter.put('/update',changePassword)
authRouter.get('/verify/:id',emailAuthen)
authRouter.get('/forgot/verify/:id',emailAuthenForgot)


export default authRouter