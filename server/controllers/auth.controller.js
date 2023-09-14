import authService from "../services/auth.service.js"

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
            if(token){
                res.json('dang nhap thanh cong')
            }
            
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

}