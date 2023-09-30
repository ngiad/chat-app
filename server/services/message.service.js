import mongoose from 'mongoose'
import modelMessage from '../models/message.model.js'
import model from '../models/room.model.js'

export default class MessageSerVice{
    constructor(){
        this.modelMessage=modelMessage
        this.modelRoom=model
    }


    getMessage=()=>{

    }

    addMessage=(idRoom,text,idUser)=>{
        return new Promise(async(resolve, reject) => {
            try {
           
                const roomModel = await model.findOne({_id:new mongoose.Types.ObjectId( idRoom)})

                if (!text)throw new Error('you must print text')
                if (!idRoom)throw new Error('roomid is not exist')
                let addMessage = await this.modelMessage.create({
                     message:text,
                     idSend:idUser,
                     roomId:idRoom
            })
            //  console.log(addMessage);
            if(!addMessage)throw new Error('add message failed')
            resolve({addMessage:'success'})
            } catch (error) {
                 reject(error)
                // console.log(error);
            }
        })
    }


    deleteMessageOne = (idMessage,idUser)=>{
        return new Promise(async(resolve, reject) => {
            try {
                if(!idMessage) throw new Error('chua co id ')
                let deleteMessage= await this.modelMessage.updateOne({_id:idMessage},{$push:{hidden:{
                user:new mongoose.Types.ObjectId(idUser)
            }}})
       
                if(!deleteMessage)throw new Error('k the xoa tin nhan')
                resolve({deleteOne:'success'})
            } catch (error) {
                reject(error)
            }
        })
    }
    deleteMessageBoth= (idMessage)=>{
        return new Promise(async(resolve, reject) => {
            try {
                if(!idMessage) throw new Error('chua co id ')
                let deleteMessageBoth = await this.modelMessage.updateOne({_id:idMessage},{message:'tin nhan nay da duoc thu hoi '})
                if(!deleteMessageBoth) throw new Error('k the xoa tin nhan')
                resolve({deleteBoth:'success'})
            } catch (error) {
                reject(error)
            }
        })
        
    }
    deleteConversation =(idRoom,idUser)=>{
        return new Promise(async(resolve, reject) => {
            try {
                if(!idRoom)throw new Error('chua co id room')
                let deleteConversation= await this.modelMessage.updateMany({roomId:idRoom},{$push:{hidden:{
                    user:new mongoose.Types.ObjectId(idUser)
                }}})
                if(!deleteConversation)throw new Error('chua co id room')
                resolve({deleteConversation:'success'})
            } catch (error) {
                reject(error)
            }
        })
    }
}