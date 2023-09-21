import model from '../models/user.model.js'
import jwt from "jsonwebtoken";
import mongoose from "mongoose";


export default class UserService {
    constructor(){
        this.model= model
    }

    getUser=()=>{
        return new Promise(async(resolve, reject) => {
            try {
                const allUser = await this.model.find({})
                resolve(allUser)
            } catch (error) {
                reject(error)
            }
        })
    }


    deleteUser =(id)=>{
        return new Promise(async(resolve, reject) => {
            try {
                const findUser = await this.model.findOne({_id:id})
                if (findUser.role=='admin')throw new Error('you are not remove admin')
                 const userDelete = await this.model.deleteOne({_id:id})
                resolve({delete:'success'})
            } catch (error) {
                reject(error)
            }
        })
    }
    getProfile = (id)=>{
        return new Promise(async(resolve, reject) => {
            try {
                const  findUser = await this.model.findOne({_id:id}).select('email avatar list_friend')
                resolve(findUser)
            } catch (error) {
                reject(error)
            }
        })
    }

    updateProfile =(email, avatar,id    )=>{
        return new Promise(async(resolve, reject) => {
            try {
                const findUser = await this.model.findOne({_id:id}).select('email avatar list_friend')
                if (!email&&!avatar){
                    throw new Error('you not change profile')
                }
                if (email==findUser.email)throw new Error('this email is exist')
                if(email&&avatar){
                    var updateUser = await this.model.updateOne({_id:id},{email:email,avatar:avatar})
                    resolve({update:'new email and new avatar'})
                }
                if (avatar){
                    var updateUser = await this.model.updateOne({_id:id},{avatar:avatar})
                    resolve({update:' new avatar'})
                }
                if(email){
                    var updateUser=await this.model.updateOne({_id:id},{email:email})
                    resolve({update:'new email'})
                }
            } catch (error) {
                reject(error)
            }
        })
    }
}
