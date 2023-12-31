import model from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { createTransport } from "nodemailer";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import fs from "fs";

export default class authService {
  constructor() {
    this.model = model;
  }

  validateEmail(email) {
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return pattern.test(email);
  }
  validatePassword(password) {
    const pattern = /^(?=.*[a-zA-Z])(?=.*\d).{6,}$/;
    return pattern.test(password);
  }
  bcryptPassword = async (password) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      return hashedPassword;
    } catch (error) {
      // Xử lý lỗi nếu cần thiết
      throw new Error("Không thể bcrypt mật khẩu");
    }
  };

  emailAuthenRegister = (token) => {
    return new Promise(async (resolve, reject) => {
      try {
        var data = this.verify(token, "taotoken");
        console.log(data);
        if (data) {
          var update = await this.model.updateOne(
            { _id: new mongoose.Types.ObjectId(data) },
            { active: true }
          );
          if (update) {
            resolve({ register: "success" });
          } else {
            throw new Error("update failed");
          }
        } else {
          throw new Error("token is invalid");
        }
      } catch (error) {
        reject(error);
      }
    });
  };

  emailAuthenForgot = (token) => {
    return new Promise(async (resolve, reject) => {
      try {
        var data = jwt.verify(token, "taotoken");
        console.log(data);
        var find = await model.findOne({
          _id: new mongoose.Types.ObjectId(data.id),
        });

        if (!find) throw new Error("user is not defined");
        else {
          var passwordNew = await this.bcryptPassword(data.newPassword);

          var update = await model.updateOne(
            { _id: new mongoose.Types.ObjectId(data.id) },
            { password: passwordNew }
          );
          resolve({ update: "success" });
        }
      } catch (error) {
        reject(error);
      }
    });
  };
  transporter = createTransport({
    service: "Gmail",
    auth: {
      user: "nguyenvanquangq013@gmail.com",
      pass: "gmthtirinpntplyo",
    },
  });

  otp() {
    return Math.floor(Math.random() * 10000);
  }

  generateTokenForgot = (id, newPassword) => {
    return jwt.sign({ id: id, newPassword: newPassword }, "taotoken", {
      expiresIn: "7d",
    });
  };
  generateRefreshToken = (id, token) => {
    return jwt.sign({ id, token }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: process.env.TIME_REFRESHTOKEN,
    });
  };
  generateToken = (id) => {
    return jwt.sign({ id }, process.env.TOKEN_SECRET, {
      expiresIn: process.env.TIME_TOKEN,
    });
  };

  verify = (token, signature) => {
    return jwt.verify(token, signature);
  };

  passwordIsCorrect = async (passwordHash, userPassWord) =>
    await bcrypt.compare(passwordHash, userPassWord);

  // resendEmail = async()
  // dang ki
  register = ({ email, password, name }) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (!this.validateEmail(email)) throw new Error("wrong email format");
        if (!this.validatePassword(password))
          throw new Error(
            "Password must have at least 6 characters including letters and numbers "
          );
        if (!email || !password || !name)
          throw new Error("Please fill in all required fields");
        if (password.length < 6)
          throw new Error("Password must be up to 6 characters");

        const userExist = await this.model.findOne({ email });
        if (userExist) throw new Error("Email has already been registereds");
        else {
          const user = await this.model.create({ email, password, name });
          var token = this.generateToken(user.id);

          await this.transporter.sendMail({
            from: "nguyenvanquangq013@gmail.com",
            to: email,
            subject: "OTP",
            html: `
                link xac thuc
                <a href='http://localhost:5000/api/auth/verify/${token}'>Click here</a>
                
            `,
          });

          resolve({ complete: true });
        }
      } catch (error) {
        reject(error);
      }
    });
  };

  // dang nhap
  login = ({ email, password }) => {
    return new Promise(async (resolve, reject) => {
      try {
        // console.log(process.env.TIME_TOKEN);
        if (!this.validateEmail(email)) throw new Error("wrong email format");
        if (!this.validatePassword(password))
          throw new Error(
            "Password must have at least 6 characters including letters and numbers "
          );
        if (!email || !password)
          throw new Error("Please fill in all required fields");
        let account = await this.model.findOne({ email });

        if (!account) {
          throw new Error("your email is not exist");
        } else {
          let correct = await this.passwordIsCorrect(
            password,
            account.password
          );
          if (!correct) throw new Error("password is wrong");
          else {
            let token = this.generateToken(account.id);
            let refreshToken = this.generateRefreshToken(account.id, token);
            resolve({
              refreshToken: refreshToken,
              Accesstoken: `${token}`,
              _id: `${account._id}`,
            });
          }
        }
      } catch (error) {
        reject(error);
      }
    });
  };
  //logout
  logout = (accessToken) => {
    return new Promise(async (resolve, reject) => {
      try {
        global.blackListToken.push(accessToken);
        console.log(global.blackListToken);
        if (!accessToken) throw new Error("token sai ");
        resolve({ logout: "success" });
      } catch (error) {
        reject(error);
      }
    });
  };
  // forgot

  forgot = ({ email, newPassword }) => {
    return new Promise(async (resolve, reject) => {
      try {
        if ((!email, !newPassword))
          throw new Error("Please fill in all required fields");

        if (newPassword.length < 6)
          throw new Error("Password must be up to 6 characters");

        var account = await this.model.findOne({ email: email });
        if (!account) throw new Error("your email is not exist");
        else {
          var token = this.generateTokenForgot(account.id, newPassword);
          await this.transporter.sendMail({
            from: "nguyenvanquangq013@gmail.com",
            to: email,
            subject: "FORGOT PASSWORD",
            html: `
                  link xac thuc
                  <a href='http://localhost:5000/api/auth/forgot/verify/${token}'>Click here</a>
              `,
          });
          resolve({ recieve: true });
        }
      } catch (error) {
        reject(error);
      }
    });
  };

  refreshToken = (oldtoken, oldReFreshToken) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (!oldtoken || !oldReFreshToken) throw new Error("token is invalid");
        // var checkToken = jwt.verify(oldtoken.token,'taotoken')
        // console.log();
        console.log(global.blackListToken);
        if (global.blackListToken.includes(oldtoken))
          throw new Error("ban da dang xuat");
        var checkReFreshToken = jwt.verify(
          oldReFreshToken,
          process.env.REFRESH_TOKEN_SECRET
        );
        if (!checkReFreshToken) throw new Error("you must login back");
        if (checkReFreshToken.token !== oldtoken)
          throw new Error("refresh token and access token do not match");
        let newToken = this.generateToken(checkReFreshToken.id);
        let newReFreshToken = this.generateRefreshToken(
          checkReFreshToken.id,
          newToken
        );
        resolve({
          accessToken: newToken,
          refreshToken: newReFreshToken,
        });
      } catch (error) {
        reject(error);
      }
    });
  };

  updatePassword = ({ email, oldPassword, newPassword }) => {
    return new Promise(async (resolve, reject) => {
      try {
        console.log(email, oldPassword, newPassword);
        if (!email || !oldPassword || !newPassword)
          throw new Error("Please fill in all required fields");
        if (newPassword.length < 6)
          throw new Error("Password must be up to 6 characters");

        var findUser = await this.model.findOne({ email: email });
        if (!findUser) {
          throw new Error("email is invalid");
        } else {
          var check = await this.passwordIsCorrect(
            oldPassword,
            findUser.password
          );
          if (!check) throw new Error("password is wrong");
          else {
            var bcryptPassword = await this.bcryptPassword(newPassword);
            await this.model.updateOne(
              { email: email },
              { password: bcryptPassword }
            );
            resolve({ changePassword: true });
          }
        }
      } catch (error) {
        reject(error);
      }
    });
  };
}
