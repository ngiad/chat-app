import model from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { createTransport } from "nodemailer";
import mongoose from "mongoose";

export default class authService {
  constructor() {
    this.model = model;
  }


  bcryptPassword= async(password)=>{
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      return hashedPassword;
    } catch (error) {
      // Xử lý lỗi nếu cần thiết
      throw new Error('Không thể bcrypt mật khẩu');
    }
  }

  emailAuthenRegister = async (token) => {
    return new Promise(async (resolve, reject) => {
      try {
        var data = this.verify(token, "taotoken");

        if (data) {
          var update = await this.model.updateOne(
            { id: new mongoose.Types.ObjectId(data) },
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

  emailAuthenForgot = async (token) => {
    return new Promise(async (resolve, reject) => {
      try {
        var data = jwt.verify(token, "taotoken");
        console.log(data);
        var find = await model.findOne({
          _id: new mongoose.Types.ObjectId(data.id),
        });
       
        if (!find) throw new Error("user is not defined");
        else {
          var passwordNew= await this.bcryptPassword(data.newPassword)
          
          var update = await model.updateOne(
            { _id: new mongoose.Types.ObjectId(data.id) },
             { password: passwordNew  }
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

  generateToken = (id) => {
    return jwt.sign({ id }, "taotoken", {
      expiresIn: "7d",
    });
  };

  verify = (token, signature) => {
    return jwt.verify(token, signature);
  };

  passwordIsCorrect = async (passwordHash, userPassWord) =>await bcrypt.compare(passwordHash, userPassWord);
    

  // resendEmail = async()
  // dang ki
  register = ({ email, password, name }) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (!email || !password || !name)
          throw new Error("Please fill in all required fields");
        if (password.length < 6)
          throw new Error("Password must be up to 6 characters");

        const userExist = await this.model.findOne({ email });
        if (userExist) throw new Error("Email has already been registereds");
        else {
          const otp = this.otp();
          const user = await this.model.create({ email, password, name, otp });
          var token = this.generateToken(user.id);

          await this.transporter.sendMail({
            from: "nguyenvanquangq013@gmail.com",
            to: email,
            subject: "OTP",
            html: `
                link xac thuc
                <a href='http://localhost:5000/api/auth/forgot/verify/${token}'>Click here</a>
                
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
        if (!email || !password)
          throw new Error("Please fill in all required fields");
        var account = await this.model.findOne({ email });

        if (!account) {
          throw new Error("your email is not exist");
        } else {
          var correct = await this.passwordIsCorrect(
            password,
            account.password
          );
          if (!correct) throw new Error("password is wrong");
          else {
            var token = this.generateToken(account.id);
            resolve(token);
          }
        }
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

  refreshToken = ( oldtoken ) => {
    return new Promise(async (resolve, reject) => {
      try {
        
        if(!oldtoken)throw new Error('token is invalid')
        var check = jwt.verify(oldtoken.token,'taotoken')
        if(!check)throw new Error('Failed to verify refresh token')
        var refreshToken= this.generateToken(check.id)
        if(refreshToken){
           resolve(refreshToken)
        }
      } catch (error) {
        reject(error)
      }
    });
  };

  updatePassword=({email,oldPassword,newPassword})=>{
    return new Promise( async(resolve, reject) => {
      try {
        console.log(email,oldPassword,newPassword);
        if (!email || !oldPassword || !newPassword)
        throw new Error("Please fill in all required fields");
        if (newPassword.length < 6)
        throw new Error("Password must be up to 6 characters");
        
        var findUser= await this.model.findOne({email:email})
        if(!findUser){
          throw new Error('email is invalid')
        }
        else{
          var check = await this.passwordIsCorrect(oldPassword,findUser.password)
          if(!check) throw new Error('password is wrong')
          else{
            var bcryptPassword= await this.bcryptPassword(newPassword)
            await this.model.updateOne({email:email},{password:bcryptPassword})
            resolve({changePassword:true})
          }
        }
        
      } catch (error) {
        reject(error)
      }
    })
  }

}
