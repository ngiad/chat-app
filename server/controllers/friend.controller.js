import FriendService from "../services/friend.service.js";
import JwtData from "../middlewares/verify.js"
import  cookieParser from "cookie-parser"



export default class FriendController{
    constructor(){
        this.service= new FriendService()
    }
    getAllFriend=async(req,res,next)=>{
        try {
           
           var user=  await this.service.getAllFriend(req.user._id)
           res.json(user)
        } catch (error) {
            res.status(400)
            next(error)
        }
    }
    addFriend= async(req,res,next)=>{
        try {
            
            var updateFriend= await this.service.addFriend(req.body.idFriend,req.user._id)
            res.json(updateFriend)
        } catch (error) {
            res.status(400)
            next(error)
        }
    }
    removeFriend= async(req,res,next)=>{
        try {
            
            var removeFriend= await this.service.removeFriend(req.body.idFriend,req.user._id)
            res.json(removeFriend)
        } catch (error) {
            res.status(400)
            next(error)
        }
    }
    
    blockFriend = async(req,res,next)=>{
        try {
            var blockFriend= await this.service.blockFriend(req.body.idFriend,req.user._id)
            res.json(blockFriend)
        } catch (error) {
            res.status(400)
            next(error)
        }
    }
    acceptFriend = async (req,res,next)=>{
        try {
            let acceptFriend= await this.service.acceptInviteAddFriend(req.body.idFriend,req.user._id)
            res.json(acceptFriend)
        } catch (error) {
            res.status(400)
            next(error)
        }
    }
}