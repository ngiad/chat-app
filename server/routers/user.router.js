import { Router } from "express"
import UserController from "../controllers/user.controller.js"
import JwtData from "../middlewares/verify.js"


const userRouter = Router()

const {verifyToken,verifyTokenTokenAdmin}= new JwtData()

const {getAllUser,deleteUser,getProfile, updateProfile} = new UserController()


userRouter.get("/",verifyTokenTokenAdmin,getAllUser)
userRouter.delete('/delete',verifyTokenTokenAdmin,deleteUser)
userRouter.get('/profile',verifyToken,getProfile)
userRouter.put('/profile/update',verifyToken,updateProfile)


export default userRouter