import { Schema, model } from "mongoose";

const roomSchema = Schema(
  {
    usersRoom: [
      {
        user: { type: Schema.Types.ObjectId },
        queryTime: { type: Date },
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
        tyoe : Boolean,
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


export default model("room-chat-app",roomSchema)
