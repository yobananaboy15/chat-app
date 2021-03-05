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

io.on("connect", (socket) => {
  //The cookie containing the JWT can be accessed here
  //Skrivs detta över? om flera personer chattar?

  socket.on("chatMessage", (message) => {
    const handshake = socket.handshake;
    //Kolla om det finns en token
    const JWT = cookie.parse(handshake.headers.cookie).token;
    //Verify the token to check that it has not expired and get user data
    jwt.verify(JWT, process.env.ACCESS_TOKEN, async (err, userData) => {
      if (err) {
        socket.emit('redirect', {url: "/login"})
        return;
      }
      io.emit("chatMessage", { username: userData.username, message });
    });
  });
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
