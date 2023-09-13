import model from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { createTransport } from "nodemailer";

export default class authService {
  constructor() {
    this.model = model;
  }


  emailAuthen=async  (token)=>{
    
      return new Promise(async (resolve,reject)=>{
        try {
          const data = await this.verify(token,'taotoken')
          if(data){
            var update=  await this.model.findByIdAndUpdate({_id:data},{active:true})
            resolve(update)
          }
          else{
            throw new Error('token is invalid')
          }
        } catch (error) {
          reject(error)
        }
      })
      // 
     
      //  if(data){
      //    const id=  await this.model.findByIdAndUpdate({_id:data},{active:true})
      //    return res.json(id)
      //  }
      //  else{
      //   res.json('khong tim thay id')
      //  }
    
    
  }
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

  generateToken = (id) => {
    return jwt.sign({ id }, 'taotoken', {
      expiresIn: "7d",
    });
  };

  verify = (token, signature) => {
    return jwt.verify(token, signature);
  };

  passwordIsCorrect = async (passwordHash, userPassWord) =>
    await bcrypt.compare(passwordHash, userPassWord);

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
          const otp =  this.otp()
          const user = await this.model.create({ email, password, name,otp });
          const token=  await this.generateToken(user._id)


          await this.transporter.sendMail({
            from : "nguyenvanquangq013@gmail.com",
            to : email, 
            subject : "OTP",
            html : `
                link xac thuc
                <a href='http://localhost:5000/api/auth/verify/${token}'>Click here</a>
                
            `
          })

          resolve({complete : true});
        }
      } catch (error) {
        reject(error)
      }
    });
  }
}
