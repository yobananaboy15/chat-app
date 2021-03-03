import Messages from "../models/messages.js";
import PublicChannels from "../models/publicChannels.js";
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
    req.user = user;
    next();
  });
};

export const renderChat = async (req, res) => {
  console.log(req.user);
  const publicChannels = await PublicChannels.find();
  console.log(publicChannels);
  const data = await Messages.find();
  //Här ska jag hämta namnen på alla public channels
  //Hämta alla meddelanden för den första channeln
  //Hämta alla private channels för den här personen.
  //Kolla vilka som är online genom socket?
  res.render("index.ejs", { messages: data, publicChannels: publicChannels });
};
