import model from '../models/room.model.js'
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
export default class RoomService {
    constructor(){
        this.model= model
    }
    createRoom = (idUser, idFriend)=>{
        return new Promise(async(resolve, reject) => {
        try {
            const check = await this.model.findOne({userRoom: {$in:[ idUser,idFriend]}})
            console.log(check);
            if(check) throw new Error('this room is exist')
            let createRoom= await this.model.create({
                queryTime:Date.now(),
                userRoom :[idFriend,idUser],
                name:'tro chuyen',
                nameRoom :`${idFriend} va ${idUser}`,
                
            })
            console.log(createRoom);
            if (!createRoom)throw new Error('create room failed')
            resolve({createRoom:'success'})
        } catch (error) {
            reject(error)
        }
           
        })
    }
}