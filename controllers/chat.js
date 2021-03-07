// import Messages from "../models/messages.js";
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

export const renderChat = async (req, res) => {
  const channelID = req.params.id

  //Find all public channels to display
  const channels = await Channels.find({private: false})

  //Hämta alla channels som är privata för den här användaren.

  //Gets the current channel and populates the messages array.
  const currentChannel = await Channels.findOne({_id: channelID}).populate('messages')
  res.render("index.ejs", { channels, currentChannel });
};