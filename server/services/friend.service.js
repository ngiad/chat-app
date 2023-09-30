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
                let myAdd=user.myadd
                let checkFriendInListFriend= listFriend.find(function(item){
                    return item==idFriend
                })
            
                
                if(checkFriendInListFriend)throw new Error('this friend is already in your friend list')


                
                myAdd.push(idFriend)
                let listPendingOfFriend=friend.list_pending
                listPendingOfFriend.push(idUser)


                let inviteAddFriend= await this.model.updateOne({_id:new mongoose.Types.ObjectId(idUser)},{myadd:myAdd})
                let pendingFriend= await this.model.updateOne({_id:new mongoose.Types.ObjectId(idFriend)},{list_pending:listPendingOfFriend})
                if(!inviteAddFriend||!pendingFriend){
                    throw new Error('add friend failed')
                }
                resolve({sendFriendInvitations:"success"})

                
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
            let listFriendOfFriend= friend.list_friend
            let newListFriendofFriend= listFriendOfFriend.filter(item=>item!=idUser)
           
            let newListFriend= listFriend.filter(item=>item!=idFriend)
            let removeFriend= await this.model.updateOne({_id:new mongoose.Types.ObjectId(idUser)},{list_friend:newListFriend})
            let removeFriendOfFriend= await this.model.updateOne({_id:new mongoose.Types.ObjectId(idFriend)},{list_friend:newListFriendofFriend})
                if(!removeFriend||!removeFriendOfFriend){
                    throw new Error('remove friend failed')
                }
                resolve({remove:"success"})

        } catch (error) {
            reject(error)
        }
    })
   }


   blockFriend = (idFriend,idUser)=>{
      return new Promise(async(resolve, reject) => {
        try {
           
            let friend= await this.model.findOne({_id:new mongoose.Types.ObjectId(idFriend)})
            if(!friend) throw new Error('idFriend is invalid')
            let user = await this.model.findOne({_id:new mongoose.Types.ObjectId(idUser)})
            let userBlock = user.black_list
            userBlock.push(idFriend)
            let blockFriend= await this.model.updateOne({_id:new mongoose.Types.ObjectId(idUser)},{black_list:userBlock})
            if(!blockFriend) throw new Error('block friend failed')
            resolve({block :'success'})
        } catch (error) {
            reject(error)
        }
      })
   }
   acceptInviteAddFriend = (idFriend,idUser)=>{
      return new Promise(async(resolve, reject) => {
        let friend= await this.model.findOne({_id:new mongoose.Types.ObjectId(idFriend)})
        if(!friend) throw new Error('idFriend is invalid')
        let user = await this.model.findOne({_id:new mongoose.Types.ObjectId(idUser)})
        let userPending=user.list_pending
        let friendMyAdd= friend.myadd
        let listFriend= user.list_friend
        listFriend.push(idFriend)
        let listFriendOfFriend= friend.list_friend
        listFriendOfFriend.push(idUser)
        let checkFriendInListPending= userPending.find(function(item){
            return item==idFriend
        })
        if (!checkFriendInListPending)throw new Error('this friend is not in listPending')
        let newListPending = userPending.filter(item=>item!=idFriend)
        let newListMyAdd= friendMyAdd.filter(item=>item!=idUser)
        let updateUser = await this.model.updateOne({_id:new mongoose.Types.ObjectId(idFriend)},{
            list_friend:listFriend,
            myadd:newListMyAdd
        })
        let updateFriend = await this.model.updateOne({_id:new mongoose.Types.ObjectId(idUser)},{
            list_friend:listFriendOfFriend,
            list_pending:newListPending
        })
        if(!updateFriend||!updateUser)throw new Error('accept is failed')
        resolve({acceptFriend:'success'})
      })
   }
}