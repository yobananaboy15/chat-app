import mongoose from 'mongoose';
import Channels from "../models/channels.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const verifyAccess = (req, res, next) => {
  const accessToken = req.cookies.token;
  if (accessToken === undefined) {
    return res.render("login.ejs", {error: 'Please log in '});
  }
  //Verify token.
  jwt.verify(accessToken, process.env.ACCESS_TOKEN, async(err, user) => {
    if (err) return res.send(err);
    
    try {
      const channelID = req.params.id
      if(!mongoose.isValidObjectId(channelID)){
        return res.redirect('/chat')
      }
      const currentChannel = await Channels.findOne({_id: channelID})
      //Kollar om kanalen är privat och om användaren har tillgång till kanalen. Om inte, redirect.
      if(currentChannel.private && !currentChannel.users.includes(user._id)){
          res.redirect('/chat')
      } else {
        //Kanalen är privat och användaren har tillgång eller kanalen är public. Oavsett har användaren tillgång
        req.user = user;
        next();
      }    
    } catch (error) {
      res.send(error.message)
    }
  });
};

export const renderChat = async (req, res) => {
  const loggedInUser = req.user._id
  const channelID = req.params.id

  try {

    const currentChannel = await Channels.findOne({_id: channelID}).populate({
      path: 'messages',
      populate: {path: 'user'}
    });

  const channels = await Channels.find({private: false})

  //Hämta alla channels som är privata för den här användaren.
  const privateChannels = await Channels.find({users: req.user._id})

  //Gets the current channel and populates the messages array.
  
  res.render("index.ejs", { channels, currentChannel, privateChannels, loggedInUser });    
  } catch (error) {
    res.send(error.message)
  }

};

export const getFirstPublicChannel = async (req, res) => {
  const firstChannel = await Channels.findOne({private: false})
  res.redirect(`/chat/${firstChannel._id}`)
}