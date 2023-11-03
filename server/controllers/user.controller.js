import UserService from "../services/user.service.js";
import JwtData from "../middlewares/verify.js"
import  cookieParser from "cookie-parser"



export default class UserController{
    constructor(){
        this.service=new UserService()
    }
    getAllUser =async(req,res,next)=>{
        try {
           
            var allUser=  await this.service.getUser(req.query.page,req.query.limit)
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
            const update = await this.service.updateProfile(req.body.gender , req.body.name, req.user.id)
            res.json(update)
        } catch (error) {
            res.status(400)
            next(error)
        }
    }
    search=async(req,res,next)=>{
        try {                                                                                                                                                                                                                                       
            const search = await this.service.searchUser(req.body.word,req.query.page,req.query.limit)
            res.json(search)
        } catch (error) {
            res.status(400)
            next(error)
        }
    }
}