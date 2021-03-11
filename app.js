import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import { createServer } from "http";
import express from "express";
import { Server } from "socket.io";
import Messages from "./models/messages.js";
import Channels from "./models/channels.js";
import Users from "./models/users.js"
import registerRoutes from "./routes/register.js"
import loginRoutes from "./routes/login.js";
import chatRoutes from "./routes/chat.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import cookieParser from "cookie-parser";
import cookie from "cookie";
import jwt from "jsonwebtoken";

//Creates socket
const app = express();
const server = createServer(app);
const io = new Server(server);

//Sets EJS as the view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//Sets routes for login and chat
app.use("/register", registerRoutes)
app.use("/login", loginRoutes);
app.use("/chat", chatRoutes);

const CONNECTION_URL = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@chat-app.lfjqy.mongodb.net/chat-app?retryWrites=true&w=majority`;

const PORT = process.env.PORT || 5000;

mongoose.connect(CONNECTION_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});


// let usersOnline = []; //Man kan använda map istället.
const usersData = {}

//Ha ett object med användardata userData = {socket.id: {username, id}}
  //När man kommer skickar meddelande - kolla socket IO efter infon
io.use((socket, next) => {
  
  //Verifies the user and creates a userObject in the
  const JWT = cookie.parse(socket.handshake.headers.cookie).token;
  jwt.verify(JWT, process.env.ACCESS_TOKEN, async (err, userData) => {
    if (err) {
      socket.emit('redirect', "/login")
      return;
    }
    //Lägg till användaren i
    let channelURL = socket.handshake.headers.referer
    const channelID = channelURL.split('/').slice(-1)[0]
    usersData[socket.id] = {...userData, channelID};
    next();
  });
})

io.on("connect", (socket) => {

  io.emit('userStatusChange', usersData)

  socket.join(usersData[socket.id].channelID)

  socket.on("chatMessage", async (message) => {
  
      io.to(usersData[socket.id].channelID).emit("chatMessage", { username: usersData[socket.id].username, message });

      const newMessage = new Messages({
        user: usersData[socket.id].username,
        message,
      });
      const newmsg = await newMessage.save();
      await Channels.updateOne({_id: usersData[socket.id].channelID}, {$push: {messages: newmsg._id}})
  });

  socket.on('startPM', async (username) => {
    const userDocument = await Users.findOne({username: username})
    const userID = userDocument._id

    //Can't start a conversation with yourself
    console.log(userID, usersData[socket.id]._id)
    console.log(userID != usersData[socket.id]._id)
    if(userID != usersData[socket.id]._id){
      const privateConvo = await Channels.findOne({users: {$all: [userID, usersData[socket.id]._id]}})
      if(!privateConvo){
        //Skapa ett dokument med ett nytt rum som har båda users i sin userArray.
        const newChannel = new Channels({
          channelname: 'test',
          private: true,
          messages: [],
          users: [userID, usersData[socket.id]._id]
        })
        const newchan = await newChannel.save();

        //Kolla om den andra användaren är online. Om hen är det, skicka den nya privata kanel
        let userdata = Object.entries(usersData)
        const onlineUser = userdata.find(user => user[1]._id == userID)
        if(onlineUser){
          io.to(onlineUser[0]).emit('channelAdded', newchan)
        }
        //Redirecta användaren som klickade på PM
        io.to(socket.id).emit('redirect', `/chat/${newchan._id}`)
      } else {
        io.to(socket.id).emit('redirect', `/chat/${privateConvo._id}`)
      }
    
    }
    
  })

  socket.on('disconnect', () =>{
    delete usersData[socket.id]
    io.emit('userStatusChange', usersData)
  })
});


server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
