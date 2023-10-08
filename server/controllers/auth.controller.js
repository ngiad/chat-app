import authService from "../services/auth.service.js"
import  cookieParser from "cookie-parser"
export default class AuthController{
    constructor(){
        this.service = new authService()
    }

    register = async(req,res,next) =>{
        try {
            res.json(await this.service.register(req.body))
        } catch (error) {
            res.status(400)
            next(error)
        }
    }

    emailAuthen=async(req,res,next)=>{
        try {
            var data=await this.service.emailAuthenRegister(req.params.id)
            res.json(data)
            
        } catch (error) {
            res.status(400)
            next(error)
        }
        
    }
    emailAuthenForgot=async(req,res,next)=>{
        try {
            var data=await this.service.emailAuthenForgot(req.params.id)
            res.json(data)
        } catch (error) {
            res.status(400)
            next(error)
        }
    }


    login= async(req,res,next)=>{
        try {
            var token = await this.service.login(req.body)
            res.cookie('accessToken',token.Accesstoken)
            res.cookie('refreshToken',token.refreshToken)
            res.json(token)
            
        } catch (error) {
            res.status(400)
            next(error)
        }
    }
    logout= async(req,res,next)=>{
        try {
            
            var logout= await this.service.logout(req.cookies.accessToken)
            res.cookie('blacklist_Token',logout.blacklist_token)
            res.json(logout)
        } catch (error) {
            res.status(400)
            next(error)
        }
    }
    forgot= async(req,res,next)=>{
        try {
            var forgot= await this.service.forgot(req.body)
            res.json(forgot)
            
        } catch (error) {
            res.status(400)
            next(error)
        }
    }

    refreshToken= async(req,res,next)=>{
        try {
            var refreshToken=await this.service.refreshToken(req.cookies.accessToken,req.cookies.refreshToken)
            res.cookie('accessToken',refreshToken.accessToken)
            res.cookie('refreshToken',refreshToken.refreshToken)
            res.json(refreshToken)

        } catch (error) {
            res.status(400)
            next(error)
        }     
    }


    changePassword=async(req,res,next)=>{
        try {
            var update=await this.service.updatePassword(req.body)
            res.json(update)
        } catch (error) {
            res.status(400)
            next(error)
        }     
    }
}