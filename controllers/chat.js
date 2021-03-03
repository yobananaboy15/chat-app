import Messages from "../models/messages.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const verifyAccess = (req, res, next) => {
  const accessToken = req.cookies.token;
  if (accessToken === undefined) {
    return res.send("Please log in");
    //Något här om token har expire
  }
  jwt.verify(accessToken, process.env.ACCESS_TOKEN, (err, user) => {
    if (err) return res.send(err);
    console.log(user);
    next();
  });
};

export const renderChat = async (req, res) => {
  const data = await Messages.find();
  res.render("index.ejs", { messages: data });
};
