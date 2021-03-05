import Messages from "../models/messages.js";
import Channels from "../models/channels.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const verifyAccess = (req, res, next) => {
  const accessToken = req.cookies.token;
  if (accessToken === undefined) {
    return res.send("Please log in");
    //Något här om token har expire
  }
  //Här bör jag kolla om personen har tillgång till kanalen.
  jwt.verify(accessToken, process.env.ACCESS_TOKEN, (err, user) => {
    if (err) return res.send(err);
    next();
  });
};

export const addMessage = (req, res) => {
  const message = req.body.msg;
  const JWT = req.cookies.token
    //Här måste jag inte parsa token, varför?
    // Verify the token to get the username
    jwt.verify(JWT, process.env.ACCESS_TOKEN, async (err, userData) => {
      if (err) return err;
      const newMessage = new Messages({
        user: userData.username,
        message,
      });
      const newmsg = await newMessage.save();
      await Channels.updateOne({_id: req.params.id}, {$push: {messages: newmsg._id}})
      res.end();
  })
}

export const renderChat = async (req, res) => {
  const channelID = req.params.id

  //Find all public channels to display
  const channels = await Channels.find({private: false})

  //Hämta alla channels som är privata för den här användaren.

  //Gets the current channel and populates the messages array.
  const currentChannel = await Channels.findOne({_id: channelID}).populate('messages')
  res.render("index.ejs", { channels, currentChannel });
};