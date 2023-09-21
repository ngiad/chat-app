import model from '../models/user.model.js'
import jwt from "jsonwebtoken";
import mongoose from "mongoose";


export default class FriendService{
    constructor(){
        this.model = model 
    }

    
    getAllFriend=(data)=>{
       
        return new Promise(async(resolve, reject) => {
            try {
                const user = await this.model.findOne({_id:data})
                if(!user){
                    throw new Error('khong tim duov data ta')
                }
                resolve(user.list_friend)
            } catch (error) {
                reject(error)
            }
            
        })
    }

    addFriend=(idFriend,idUser)=>{
        return new Promise(async(resolve, reject) => {
            try {
                
                let friend= await this.model.findOne({_id:new mongoose.Types.ObjectId(idFriend)})
                if(!friend) throw new Error('idFriend is invalid')

                let user = await this.model.findOne({_id:new mongoose.Types.ObjectId(idUser)})

                let listFriend= user.list_friend
                let checkFriendInListFriend= listFriend.find(function(item){
                    return item==idFriend
                })
            
                
                if(checkFriendInListFriend)throw new Error('this friend is already in your friend list')


                
                listFriend.push(idFriend)
                let listFriendOfFriend=friend.list_friend
                listFriendOfFriend.push(idUser)


                let addFriendUser= await this.model.updateOne({_id:new mongoose.Types.ObjectId(idUser)},{list_friend:listFriend})
                let addFriend= await this.model.updateOne({_id:new mongoose.Types.ObjectId(idFriend)},{list_friend:listFriendOfFriend})
                if(!addFriend||!addFriendUser){
                    throw new Error('add friend failed')
                }
                resolve({update:"success"})

                
            } catch (error) {
                reject(error)
            }
        })
    }


   removeFriend= (idFriend,idUser)=>{
    return new Promise(async(resolve, reject) => {
        try {
       
            let friend= await this.model.findOne({_id:new mongoose.Types.ObjectId(idFriend)})
            if(!friend) throw new Error('idFriend is invalid')

            let user = await this.model.findOne({_id:new mongoose.Types.ObjectId(idUser)})
            let listFriend= user.list_friend
            let checkFriendInListFriend= listFriend.find(function(item){
                return item==idFriend
            })
            if(!checkFriendInListFriend) throw new Error('idFriend is not in list friend')
            let newListFriend= listFriend.filter(item=>item!=idFriend)
            let addFriend= await this.model.updateOne({_id:new mongoose.Types.ObjectId(idUser)},{list_friend:newListFriend})
                if(!addFriend){
                    throw new Error('add friend failed')
                }
                resolve({remove:"success"})

        } catch (error) {
            reject(error)
        }
    })
   }
}