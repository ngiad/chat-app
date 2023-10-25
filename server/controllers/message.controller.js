import MessageSerVice from "../services/message.service.js";
import model from "../models/room.model.js";
import messageModel from "../models/message.model.js";
export default class MessageController{
    constructor(){
        this.service=new MessageSerVice()
        this.modelRoom = model
        this.modelMessage=messageModel
    }

    checkRoom = async(req,res,next)=>{
        try {
            const checkRoom = await this.modelRoom.findOne({_id:req.params.idRoom,userRoom:{$in:[req.user._id]}})
            if(!checkRoom)throw new Error('you dont belong to this group')
            else{
             next()
            }
        } catch (error) {
            res.status(400)
            next(error)
        }
    }
    


    checkIdSend = async(req,res,next)=>{
        try {
            const checkIdSend= await this.modelMessage.findOne({_id:req.body.idMessage,idSend:req.user._id})
            if (!checkIdSend) throw new Error('you can only delete on your side')
            else{
            next()
        }
        } catch (error) {
            res.status(400)
            next(error)
        }
    }
    getMessage=async(req,res,next)=>{
        try {
          
            let getMessage= await this.service.getMessage(req.body.idRoom,req.query.page,req.query.limit,req.user._id)

            res.json(getMessage)
        } catch (error) {
            res.status(400)
            next(error)
        }
    }
    addMessage=async(req,res,next)=>{
        try {
            // console.log(req.user._id);
            // console.log();
           let addMessage= await this.service.addMessage(req.params.idRoom ,req.body.text,req.user._id) 
           res.json(addMessage)
        } catch (error) {
            res.status(400)
            next(error)
            console.log(error);
        }
    }
    deleteMessageOne= async(req,res,next)=>{
        try {
            let deleteMessageOne= await this.service.deleteMessageOne(req.params.idRoom,req.body.idMessage,req.user._id)
            res.json(deleteMessageOne)
        } catch (error) {
            res.status(400)
            next(error)
        }
    }
    deleteMessageBoth= async(req,res,next)=>{
        try {
            let deleteMessageBoth= await this.service.deleteMessageBoth(req.params.idRoom,req.body.idMessage,req.user._id)
            res.json(deleteMessageBoth)
        } catch (error) {
            res.status(400)
            next(error)
        }
    }
    deleteConservation = async(req,res,next)=>{
        try {
            let deleteConservation= await this.service.deleteConversation(req.body.idRoom,req.user._id)
            res.json(deleteConservation)
        } catch (error) {
            res.status(400)
            next(error)
        }
    }
}