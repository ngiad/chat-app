import model from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { createTransport } from "nodemailer";

export default class authService {
  constructor() {
    this.model = model;
  }

  transporter = createTransport({
    service: "Gmail",
    auth: {
      user: "devwebdainghia@gmail.com",
      pass: "_aampknaozdbfzoez",
    },
  });

  async otb() {
    return Math.floor(Math.random() * 10000);
  }

  generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
  };

  verify = (token, signature) => {
    return jwt.verify(token, signature);
  };

  passwordIsCorrect = async (passwordHash, userPassWord) =>
    await bcrypt.compare(passwordHash, userPassWord);

  register({ email, password, name }) {
    return new Promise(async (resolve, reject) => {
      try {
        if (!email || !password || name)
          throw new Error("Please fill in all required fields");
        if (password.length > 6)
          throw new Error("Password must be up to 6 characters");

        const userExist = await this.model.find({ email });

        if (userExist) throw new Error("Email has already been registereds");
        else {
          const user = await this.model.create({ email, password, name });
          const token = this.generateToken(user["_id"]);

          const { name, avatar, email } = user;

          resolve({});
        }
      } catch (error) {}
    });
  }
}
