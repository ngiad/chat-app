import { Schema, model } from "mongoose";

const roomSchema = Schema(
  {
   queryTime:{
    type:Date
   } ,
    userRoom: [
      {
         type: Schema.Types.ObjectId ,
          ref:'user-chat-app'
      },
    ],
    
    nameRoom: {
      type: String,
      required: true,
    },
    name : {
        type : String,
        required : true
    },
    isGroup : {
        type : Boolean,
        default :  false
    },

    avatarGroup : {
        type : String,
        default : 'http://localhost:5000/public/avatargroup.png'
    }
  },
  {
    timestamps: true,
  }
);

roomSchema.index({'$**': 'text'})

export default model("room-chat-app",roomSchema)
