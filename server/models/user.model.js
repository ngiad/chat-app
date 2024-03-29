import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs"

const userSchema = Schema({
    email: {
        type: String,
        required: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please enter a valid email",
        ],
        trim: true,
        unique: true
    },

    name: {
        type: String,
        required: true,
        trim: true
    },

    avatar : {
        type : String,
        default : ""
    },

    password: {
        type: String,
        require: [true, "Please add your password"],
        minlength: [6, " Password must be up to 6 characters"],
        trim: true
    },

    list_friend: [{
        friend_id :{ type: Schema.Types.ObjectId, ref: "user-chat-app" }, 
        time :Date
    }],
    black_list  : [{ type: Schema.Types.ObjectId, ref: "user-chat-app" }],
    role : {
        type : String,
        default : "user"
    },
    otp : {
        type : Number
    },
    active:{
        type : Boolean,
         default : false
    },
    gender :{
        type:String,
        require:true
    }
},{
    timestamps :  true
});


userSchema.index({'$**': 'text'})

userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        return next()
    }
       
    const salt = await bcrypt.genSalt(10)
    const hashedPassword =  bcrypt.hash(this.password, salt)
    this.password = hashedPassword
    next()
})



export default model("user-chat-app",userSchema)




