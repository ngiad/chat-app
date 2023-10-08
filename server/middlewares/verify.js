import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import model from "../models/user.model.js";
 
export default class JwtData {
    generateToken = (id) => {
        return jwt.sign({ id }, "taotoken", {
          expiresIn: "24h",
        });
      };
    
    
    
    verifyTokenTokenAdmin =async(req,res,next)=>{
        try {
            const token = req.cookies.token
            
            if(token){
             let data=jwt.verify(token,'taotoken') 
             
             if(!data)throw new Error('token is not valid')
             var user=await model.findOne({_id:data.id})
             if(!user.active)throw new Error('this account is not active')
             if(user.role!=='admin'){
                 throw new Error('this account is not admin')
             }
            

            if (user.role=='admin'){
                req.data=user;
                next()
             }
             
             
            }
            else throw new Error('you are not authenticated')
        } catch (error) {
            res.status(400)
            next(error)

        }
    }


    
    verifyTokenTokenManager =async(req,res,next)=>{
        try {
            const token = req.cookies.token
            
            if(token){
             let data=jwt.verify(token,'taotoken') 
             if(!data)throw new Error('token is not valid')
             var user=await model.findOne({_id:data.id})
             if(!user.active)throw new Error('this account is not active')
             
             if (user.role=='manager'){
                req.data=user;
                next()
             }
             
            }
            else throw new Error('you are not authenticated')
        } catch (error) {
            res.status(400).json(error)

        }
    }

    verifyToken =async (req,res,next) => {
        try {
            const accessToken = req.cookies.accessToken
            let blacklist_Token= req.cookies.blacklist_Token
            if (accessToken==blacklist_Token)throw new Error('Token is invalid ')
            
            if(accessToken){
             let data=jwt.verify(accessToken,process.env.TOKEN_SECRET) 
          
             if(!data)throw new Error('token is not valid')
             var user=await model.findOne({_id:data.id})
             if(!user.active)throw new Error('this account is not active')
             req.user=user;
             
             next()
            }
            else throw new Error('you are not authenticated')
        } catch (error) {
            res.status(400)
            next(error)

        }
      

    };

}