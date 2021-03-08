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
app.use("/login", loginRoutes);
app.use("/chat", chatRoutes);

const CONNECTION_URL = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@chat-app.lfjqy.mongodb.net/chat-app?retryWrites=true&w=majority`;

const PORT = process.env.PORT || 5000;

mongoose.connect(CONNECTION_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});


let usersOnline = []; //Man kan använda map istället.
const usersData = {}

//Ha ett object med användardata userData = {socket.id: {username, id}}
  //När man kommer skickar meddelande - kolla socket IO efter infon
io.use((socket, next) => {
  
  //Verifies the user and creates a userObject in the
  const JWT = cookie.parse(socket.handshake.headers.cookie).token;
  jwt.verify(JWT, process.env.ACCESS_TOKEN, async (err, userData) => {
    if (err) {
      socket.emit('redirect', {url: "/login"})
      return;
    }
    usersData[socket.id] = {...userData};
    let channelURL = socket.handshake.headers.referer
    usersData[socket.id].channelID = channelURL.split('/').slice(-1)[0]
    usersOnline.push(usersData[socket.id].username)
    next();
  });
})

io.on("connect", (socket) => {

  io.emit('userStatusChange', usersOnline)

  socket.on("chatMessage", async (message) => {
  
      io.emit("chatMessage", { username: usersData[socket.id].username, message });

      const newMessage = new Messages({
        user: usersData[socket.id].username,
        message,
      });
      const newmsg = await newMessage.save();
      await Channels.updateOne({_id: usersData[socket.id].channelID}, {$push: {messages: newmsg._id}})
  });

  socket.on('disconnect', () =>{
    // filterar usersOnline och ta bort socket.id från usersData och emitta online
    usersOnline = usersOnline.filter(user => user !== usersData[socket.id].username)
    delete usersData[socket.id]
    io.emit('userStatusChange', usersOnline)
  })
});



server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
