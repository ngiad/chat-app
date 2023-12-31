import { Router } from "express"
import UserController from "../controllers/user.controller.js"
import JwtData from "../middlewares/verify.js"


const userRouter = Router()

const {verifyToken,verifyTokenTokenAdmin}= new JwtData()

const {getAllUser,deleteUser,getProfile, updateProfile,search} = new UserController()


userRouter.get("/",verifyTokenTokenAdmin,getAllUser)
userRouter.delete('/delete',verifyTokenTokenAdmin,deleteUser)
userRouter.get('/profile',verifyToken,getProfile)
userRouter.put('/me',verifyToken,updateProfile)
userRouter.post('/search',verifyToken,search)


export default userRouter