import FriendService from "../services/friend.service.js";
import JwtData from "../middlewares/verify.js"
import  cookieParser from "cookie-parser"



export default class FriendController{
    constructor(){
        this.service= new FriendService()
    }
    getAllFriend=async(req,res,next)=>{
        try {
            
           var user=  await this.service.getAllFriend(req.query.page,req.query.limit,req.user._id,req.query.gender,req.query.recent)
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
    removeBlock = async (req,res,next)=>{
        try {
            let removeBlock= await this.service.removeBlock(req.body.idFriend,req.user._id)
            res.json(removeBlock)
        } catch (error) {
            res.status(400)
            next(error)
        }
    }
}