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
            res.json(  await this.service.emailAuthen(req.params.id))
        } catch (error) {
            res.status(400)
            next(error)
        }
        
    }
}