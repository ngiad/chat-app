import RoomService from "../services/room.service.js"
import JwtData from "../middlewares/verify.js"
import  cookieParser from "cookie-parser"


export default class RoomController {
    constructor(){
        this.service = new RoomService()
    }
    createRoom =async(req,res,next)=>{
        try {
        
            var createRoom =await this.service.createRoom(req.user.id,req.body.idFriend)
            
            console.log(createRoom);
            res.json(createRoom)
        } catch (error) {
            res.status(400)
            next(error)
        }
    }
}