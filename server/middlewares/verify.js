import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import model from "../models/user.model.js";
 
export default class JwtData {
    generateToken = (id) => {
        return jwt.sign({ id }, "taotoken", {
          expiresIn: "24h",
        });
      };
    
    // checkAdmin(){
    //     if(role == 'admin')
    // }

    // checkManager(){
    //     if(role == 'admin' || role == 'manager')

    // }

    // checkUser(){
    //     if(role == 'admin' || role == 'manager' || role == ủe)

    // }
    
    verifyTokenTokenAdmin =async(req,res,next)=>{
        try {
            const token = req.cookies.token
            
            if(token){
             let data=jwt.verify(token,'taotoken') 
          
             if(!data)throw new Error('token is not valid')
             var user=await model.findOne({_id:data.id})
             if(!user.active)throw new Error('this account is not active')
             req.data=data;
             if (data.role=='admin'){
                next()
             }
             
            }
            else throw new Error('you are not authenticated')
        } catch (error) {
            res.status(400).json(error)

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
             req.data=data;
             if (data.role=='manager'){
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
            const token = req.cookies.token
            
            if(token){
             let data=jwt.verify(token,'taotoken') 
          
             if(!data)throw new Error('token is not valid')
             var user=await model.findOne({_id:data.id})
             if(!user.active)throw new Error('this account is not active')
             req.data=data;
             
             next()
            }
            else throw new Error('you are not authenticated')
        } catch (error) {
            res.status(400).json(error)

        }
      

    };

}