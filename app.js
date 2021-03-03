import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import { createServer } from "http";
import express from "express";
import { Server } from "socket.io";
import Messages from "./models/messages.js";
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
app.use(express.urlencoded({ extended: false }));
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

  socket.on("chatMessage", (message) => {
    let handshake = socket.handshake;
    //Parse the cookie containing the JWT
    console.log(handshake);
    const JWT = cookie.parse(handshake.headers.cookie).token;
    //Verify the token to get the username
    jwt.verify(JWT, process.env.ACCESS_TOKEN, (err, userData) => {
      if (err) return err;
      const newMessage = new Messages({
        user: userData.username,
        message,
      });
      newMessage.save();
      io.emit("chatMessage", { username: userData.username, message });
    });
  });
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
