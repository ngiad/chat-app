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
  filterGender =async(gender,userId)=>{
    return this.model.findOne({ _id: idUser })
    .select("list_friend -_id")
    .populate("list_friend", "email avartar name gender")
  }
   isTimeWithinOneMonth(timeToCheck) {
    const currentTime = new Date(); // Lấy thời gian hiện tại.
    const oneMonthInMilliseconds = 30 * 24 * 60 * 60 * 1000; // 1 tháng tính bằng mili giây.
  
    // Tính khoảng thời gian giữa thời gian hiện tại và thời gian cần kiểm tra.
    const timeDifference = currentTime.getTime() - new Date(timeToCheck).getTime();
  
    // So sánh khoảng thời gian với 1 tháng tính bằng mili giây.
    if (timeDifference < oneMonthInMilliseconds) {
      return true; // Thời gian nhỏ hơn 1 tháng.
    } else {
      return false; // Thời gian lớn hơn hoặc bằng 1 tháng.
    }
  }
  
  getAllFriend = (page, limit, idUser,gender,recent) => {
    return new Promise(async (resolve, reject) => {
      try {
        const friend = await this.pagination(
          this.model
            .findOne({ _id: idUser })
            .select("list_friend -_id")
            .populate("list_friend.friend_id", "email avartar name gender")
        ).data;
        let listFriendFilterGender ;
        let listFriendFilterRecent
        if (gender){
          listFriendFilterGender= friend.list_friend.filter (item=>item.friend_id.gender==gender)
        }
        else{
          listFriendFilterGender= friend.list_friend
        }
        
        if (recent=='true'){
          listFriendFilterRecent=listFriendFilterGender.filter(item=>this.isTimeWithinOneMonth(item.time))
        }
        else {
          listFriendFilterRecent= listFriendFilterGender
        }
        const dataFriend = listFriendFilterRecent.slice(
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
          { $push: { list_friend: {friend_id:idFriend,time:Date.now()} } }
        );
        const add = await this.model.updateOne(
          { _id: idFriend },
          { $push: { list_friend: {friend_id:idUser,time:Date.now()} } }
        );

        resolve({ sendFriendInvitations: "success" });
      } catch (error) {
        reject(error);
        console.log(error);
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
        if (!idFriend) throw new Error("you need more infomation");
        let user = await this.model.findOne({
          _id: new mongoose.Types.ObjectId(idUser),
          black_list:{$in:[idFriend]}
        });
        if (user)throw new Error("This friend is on the block list ");
        let blockFriend = await this.model.updateOne(
          { _id: new mongoose.Types.ObjectId(idUser) },
          { $push: { black_list: idFriend } }
        );
        if (!blockFriend.modifiedCount) throw new Error("block friend failed");
        resolve({ block: "success" });
      } catch (error) {
        reject(error);
        console.log(error);
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
      return { removeBlock: "success" };
    } catch (error) {
      throw error;
    }
  };
}