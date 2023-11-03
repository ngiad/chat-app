import model from "../models/user.model.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export default class UserService {
  constructor() {
    this.model = model;
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
  getUser = (page, limit) => {
    return new Promise(async (resolve, reject) => {
      try {
        const allUser = this.pagination(this.model.find({}), page, limit);
        let data = await allUser.data;
        let count = await this.model.countDocuments();
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

  deleteUser = (id) => {
    return new Promise(async (resolve, reject) => {
      try {
        const findUser = await this.model.findOne({ _id: id });
        if (findUser.role == "admin")
          throw new Error("you are not remove admin");
        const userDelete = await this.model.deleteOne({ _id: id });
        resolve({ delete: "success" });
      } catch (error) {
        reject(error);
      }
    });
  };
  getProfile = (id) => {
    return new Promise(async (resolve, reject) => {
      try {
        const findUser = await this.model
          .findOne({ _id: id })
          .select("email avatar list_friend");
        resolve(findUser);
      } catch (error) {
        reject(error);
      }
    });
  };

  updateProfile = (gender, name, userId) => {
    return new Promise(async (resolve, reject) => {
      try {
        var newUser = {}
        if (!gender && !name) {
          throw new Error("you not change profile");
        }
        if(gender)newUser.gender=gender
        if(name)newUser.name=name
        
        const updateProfile= await this.model.updateOne({_id:userId},newUser)
        resolve({update:'success'})
      } catch (error) {
        reject(error);
      }
    });
  };

  searchUser = (word, page, limit) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (!word) throw new Error("you need more infomation");
        var search = this.pagination(
          this.model.find({ $text: { $search: word } }).select("-password"),
          page,
          limit
        );

        const data = await search.data;
        const countQuery = await this.model
          .find({ $text: { $search: word } })
          .select("-password");
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
}
