import UserService from "../services/user.service.js";
import JwtData from "../middlewares/verify.js"
import  cookieParser from "cookie-parser"



export default class UserController{
    constructor(){
        this.service=new UserService()
    }
    getAllUser =async(req,res,next)=>{
        try {
           
            var allUser=  await this.service.getUser()
            res.json(allUser)
         } catch (error) {
             res.status(400)
             next(error)
         }
    }
    deleteUser = async(req,res,next)=>{
        try {
            var deleteUser = await this.service.deleteUser(req.body.id)
            res.json(deleteUser)
        } catch (error) {
            res.status(400)
             next(error)
        }
    }
    getProfile = async(req,res,next)=>{
        try {
            var getProfile = await this.service.getProfile(req.user.id)
            res.json(getProfile)
        } catch (error) {
            res.status(400)
            next(error)
        }
    }


    updateProfile = async(req,res,next)=>{
        try {
            const update = await this.service.updateProfile(req.body.email , req.body.avatar, req.user.id)
            res.json(update)
        } catch (error) {
            res.status(400)
            next(error)
        }
    }
}