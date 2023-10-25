import mongoose from "mongoose";
import modelMessage from "../models/message.model.js";
import model from "../models/room.model.js";
import modelUser from "../models/user.model.js";
export default class MessageSerVice {
  constructor() {
    this.modelMessage = modelMessage;
    this.modelRoom = model;
    this.modelUser = modelUser;
  }

  pagination = (query, page, limit) => {
    if (!limit)
      return {
        data: query
          .limit(process.env.LIMIT)
          .skip((page - 1) * process.env.LIMIT),
      };
    else {
      return {
        data: query.limit(limit).skip((page - 1) * limit),
      };
    }
  };
  getMessage = (idRoom, page, limit, idUser) => {
    return new Promise(async (resolve, reject) => {
      try {
        const check = await this.modelRoom.findOne({ _id: idRoom });
        if (!check.userRoom.includes(idUser))
          throw new Error("you dont belong to this group");
        const getMessage = this.pagination(
          this.modelMessage.find({
            roomId: new mongoose.Types.ObjectId(idRoom),
          }),
          page,
          limit
        );
        let data = await getMessage.data;
        let countQuery = await this.modelMessage.find({
          roomId: new mongoose.Types.ObjectId(idRoom),
        });
        const count = countQuery.length;
        resolve({
          data: data,
          pagination: {
            prev: page > 1 ? parseInt(page) - 1 : null,
            page: page,
            next:
              page < Math.floor(count / process.env.LIMIT)
                ? parseInt(page) + 1
                : null,
            total: count,
          },
        });
      } catch (error) {
        reject(error);
      }
    });
  };

  addMessage = async (idRoom, text, idUser) => {
    try {
      let idFriend = await this.modelRoom.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(idRoom),
          },
        },
        {
          $project: {
            userRoom: {
              $filter: {
                input: "$userRoom",
                cond: {
                  $ne: ["$$this", new mongoose.Types.ObjectId(idUser)],
                },
              },
            },
          },
        },
      ]);
      const checkRoom = this.modelRoom.findOne({
        _id: new mongoose.Types.ObjectId(idRoom),
      });

      const checkBlacklist = this.modelUser.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(idUser),
          },
        },
        {
          $project: {
            black_list: {
              $filter: {
                input: "$black_list",
                cond: {
                  $eq: [
                    "$$this",
                    new mongoose.Types.ObjectId(idFriend[0].userRoom[0]),
                  ],
                },
              },
            },
          },
        },
      ]);
      const checkBlacklistFriend = this.modelUser.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(idFriend[0].userRoom[0]),
          },
        },
        {
          $project: {
            black_list: {
              $filter: {
                input: "$black_list",
                cond: {
                  $eq: ["$$this", new mongoose.Types.ObjectId(idUser)],
                },
              },
            },
          },
        },
      ]);
      const [room, blacklistSending, blacklistRecieve] = await Promise.all([
        checkRoom,
        checkBlacklist,
        checkBlacklistFriend,
      ]);
      if (blacklistSending[0].black_list.length)
        throw new Error("you have blocked this user");
      if (blacklistRecieve[0].black_list.length)
        throw new Error("this user is blocked");
      if (!room) {
        throw new Error("this room is not exist");
      }

      if (!room.userRoom.includes(idUser))
        throw new Error("you dont belong to this group");
      if (!text) throw new Error("you must print text");
      if (!idRoom) throw new Error("roomid is not exist");
      let addMessage = await this.modelMessage.create({
        message: text,
        idSend: idUser,
        roomId: idRoom,
      });
      if (!addMessage) throw new Error("add message failed");
      return { addMessage: "success" };
    } catch (error) {
      throw error;
    }
  };

  deleteMessageOne = (idRoom, idMessage, idUser) => {
    return new Promise(async (resolve, reject) => {
      try {
        console.log(idRoom);
        const check = await this.modelRoom.findOne({ _id: idRoom });
        if (!check.userRoom.includes(idUser))
          throw new Error("you dont belong to this group");

        let deleteMessage = await this.modelMessage.updateOne(
          { _id: idMessage ,hidden:{$nin:[idUser    ]}},
          { $push: { hidden: new mongoose.Types.ObjectId(idUser) } }
        );
        console.log(deleteMessage);
        if (!deleteMessage.modifiedCount) throw new Error("can not remove message");
        resolve({ deleteOne: "success" });
      } catch (error) {
        reject(error);
      }
    });
  };
  deleteMessageBoth = (idRoom, idMessage, idUser) => {
    return new Promise(async (resolve, reject) => {
      try {
        let deleteMessageBoth = await this.modelMessage.updateOne(
          { _id: idMessage,isDeleted:false },
          { isDeleted: true }
        );
        if (!deleteMessageBoth.modifiedCount) throw new Error("can not remove message");
        resolve({ deleteBoth: "success" });
      } catch (error) {
        reject(error);
      }
    });
  };
  deleteConversation = (idRoom, idUser) => {
    return new Promise(async (resolve, reject) => {
      try {
        const check = await this.modelRoom.findOne({ _id: idRoom });
        if (!check.userRoom.includes(idUser))
          throw new Error("you dont belong to this group");
        if (!idRoom) throw new Error("chua co id room");
        let deleteConversation = await this.modelMessage.deleteMany({
          roomId: idRoom,
        });
        if (!deleteConversation) throw new Error("chua co id room");
        resolve({ deleteConversation: "success" });
      } catch (error) {
        reject(error);
      }
    });
  };
}
