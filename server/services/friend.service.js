import model from "../models/user.model.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export default class FriendService {
  constructor() {
    this.model = model;
  }

  pagination = (query) => {
    return {
      data: query,
    };
  };

  getAllFriend = (page, limit, idUser) => {
    return new Promise(async (resolve, reject) => {
      try {
        const friend = await this.pagination(
          this.model
            .findOne({ _id: idUser })
            .select("list_friend -_id")
            .populate("list_friend", "email avartar name")
        ).data;
        const dataFriend = friend.list_friend.slice(
          `${(parseInt(page) - 1) * limit}`,
          `${parseInt(page) * limit}`
        );
        const count = friend.list_friend.length;
        resolve({
          data: dataFriend,
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

  addFriend = (idFriend, idUser) => {
    return new Promise(async (resolve, reject) => {
      try {
        let friend = await this.model.findOne({
          _id: new mongoose.Types.ObjectId(idFriend),
        });
        if (!friend) throw new Error("idFriend is invalid");
        let user = await this.model.findOne({
          _id: new mongoose.Types.ObjectId(idUser),
        });
        if (user.black_list.includes(idFriend))
          throw new Error("You have blocked this user");
        let listFriend = user.list_friend;
        let checkFriendInListFriend = listFriend.includes(idFriend);
        if (checkFriendInListFriend)
          throw new Error("this friend is already in your friend list");
        const addFriend = await this.model.updateOne(
          { _id: idUser },
          { $push: { list_friend: idFriend } }
        );
        const add = await this.model.updateOne(
          { _id: idFriend },
          { $push: { list_friend: idUser } }
        );

        resolve({ sendFriendInvitations: "success" });
      } catch (error) {
        reject(error);
      }
    });
  };

  getFriendshipsAfterDelete(idFriend, idUser) {
    return this.model.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(idUser),
        },
      },
      {
        $project: {
          friend_exist_or_not: {
            $filter: {
              input: "$list_friend",
              cond: {
                $eq: ["$$this", new mongoose.Types.ObjectId(idFriend)],
              },
            },
          },
          list_friend_updated: {
            $filter: {
              input: "$list_friend",
              cond: {
                $ne: ["$$this", new mongoose.Types.ObjectId(idFriend)],
              },
            },
          },
        },
      },
    ]);
  }

  updateListFriend(idUser, listFriend) {
    return this.model.updateOne(
      { _id: new mongoose.Types.ObjectId(idUser) },
      { list_friend: listFriend }
    );
  }

  removeFriend = async (idFriend, idUser) => {
    try {
      const friendShip = this.getFriendshipsAfterDelete(idFriend, idUser);
      const checkRemovePassive = this.getFriendshipsAfterDelete(
        idUser,
        idFriend
      );
      const [checkIdFriendAndremoveActive, removePassive] = await Promise.all([
        friendShip,
        checkRemovePassive,
      ]);
      let isError =
        checkIdFriendAndremoveActive[0].friend_exist_or_not.length <= 0;
      if (isError) throw new Error("id Friend is not belong to list friend");
      let promiseRemoveFriendActive = this.updateListFriend(
        idUser,
        checkIdFriendAndremoveActive[0].list_friend_updated
      );
      let promiseRemoveFriendPassive = this.updateListFriend(
        idFriend,
        removePassive[0].list_friend_updated
      );
      const [removeFriendActive, removeFriendPassive] = await Promise.all([
        promiseRemoveFriendActive,
        promiseRemoveFriendPassive,
      ]);
      if (!removeFriendActive || !removeFriendPassive) {
        throw new Error("remove friend failed");
      }
      return { remove: "success" };
    } catch (error) {
      throw error;
    }
  };

  blockFriend = (idFriend, idUser) => {
    return new Promise(async (resolve, reject) => {
      try {
        let friend = await this.model.findOne({
          _id: new mongoose.Types.ObjectId(idFriend),
        });
        if (!friend) throw new Error("idFriend is invalid");

        console.log(friend.black_list);
        let user = await this.model.findOne({
          _id: new mongoose.Types.ObjectId(idUser),
        });
        if (user.black_list.includes(idFriend))
          throw new Error("This friend is on the block list ");
        let blockFriend = await this.model.updateOne(
          { _id: new mongoose.Types.ObjectId(idUser) },
          { $push: { black_list: idFriend } }
        );
        console.log(blockFriend);
        if (!blockFriend) throw new Error("block friend failed");
        resolve({ block: "success" });
      } catch (error) {
        reject(error);
      }
    });
  };

  removeBlock = async (idFriend, idUser) => {
    try {
      if (!idFriend) throw new Error("you need more infomation");
      const check = await this.model.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(idUser),
            black_list: {
              $in: [new mongoose.Types.ObjectId(idFriend)],
            },
          },
        },
      ]);
      if (!check) throw new Error("this friend is not in blacklist");
      let removeBlock = await this.model.updateOne(
        { _id: new mongoose.Types.ObjectId(idUser) },
        [
          {
            $set: {
              black_list: {
                $filter: {
                  input: "$list_friend",
                  cond: {
                    $ne: ["$$this", new mongoose.Types.ObjectId(idFriend)],
                  },
                },
              },
            },
          },
        ]
      );
      console.log(removeBlock);
      return { removeBlock: "success" };
    } catch (error) {
      throw error;
    }
  };
}