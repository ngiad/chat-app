import { Schema, model } from "mongoose";

const messageSchema =  Schema(
  {
    message: {
      type: String,
      required: true,
    },
    idSend: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    hidden: [{
      type: Schema.Types.ObjectId ,
    },
      
    ],

    roomId : {
        type :  String,
        require : true
    },
    isDeleted:{
      type:Boolean,
      default:false
    }
  },
  {
    timestamps: true,
  }
);


export default model("message-chat-app",messageSchema)