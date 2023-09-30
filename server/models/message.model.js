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
    hidden: {
      type: [
        {
          user: { type: Schema.Types.ObjectId },
         
        },
      ],
      default : []
    },

    roomId : {
        type :  String,
        require : true
    }
  },
  {
    timestamps: true,
  }
);


export default model("message-chat-app",messageSchema)