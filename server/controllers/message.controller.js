import MessageSerVice from "../services/message.service.js";


export default class MessageController{
    constructor(){
        this.service=new MessageSerVice()
    }
    getMessage=async(req,res,next)=>{
        try {
            let getMessage= await this.service.getMessage(req.body.idRoom,req.query.page,req.query.limit)
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
           let addMessage= await this.service.addMessage(req.body.idRoom ,req.body.text,req.user._id) 
           res.json(addMessage)
        } catch (error) {
            res.status(400)
            next(error)
        }
    }
    deleteMessageOne= async(req,res,next)=>{
        try {
            let deleteMessageOne= await this.service.deleteMessageOne(req.params.id,req.user._id)
            res.json(deleteMessageOne)
        } catch (error) {
            res.status(400)
            next(error)
        }
    }
    deleteMessageBoth= async(req,res,next)=>{
        try {
            let deleteMessageBoth= await this.service.deleteMessageBoth(req.params.id)
            res.json(deleteMessageBoth)
        } catch (error) {
            res.status(400)
            next(error)
        }
    }
    deleteConservation = async(req,res,next)=>{
        try {
            let deleteConservation= await this.service.deleteConversation(req.params.idRoom,req.user._id)
            res.json(deleteConservation)
        } catch (error) {
            res.status(400)
            next(error)
        }
    }
}