import mongoose from "mongoose";

const ConnentDB = () => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect("mongodb+srv://Ngiad:Ngiad001@cluster0.2ts8aja.mongodb.net/")
      .then(() => resolve("Connent DB OK!"))
      .catch((err) => reject(err));
  });
};

export default ConnentDB;
