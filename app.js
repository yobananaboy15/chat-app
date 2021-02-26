const path = require("path");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const Messages = require("./models/messages");
const { json } = require("body-parser");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, "public")));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", async (req, res) => {
  const data = await Messages.find();
  //Gör ett anrop till databasen för att få de existerande posterna i databasen. Skicka dem till EJS-templatet.
  //När någon postar ett nytt meddelande, lägg till det i databasen, och kör en emit på meddelandet till alla som redan är anslutna.
  //Data om vilken channel
  res.render("index.ejs", { messages: data });
});

const CONNECTION_URL = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@chat-app.lfjqy.mongodb.net/chat-app?retryWrites=true&w=majority`;

const PORT = process.env.PORT || 5000;

mongoose.connect(CONNECTION_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

io.on("connect", (socket) => {
  console.log("new web socket connection");

  socket.emit("message", "Welcome to the chat!");

  socket.broadcast.emit("message", "A user has joined the chat");

  socket.on("disconnect", () => {
    io.emit("message", "A user has left the chat");
  });

  socket.on("chatMessage", (msg) => {
    const newMessage = new Messages({ user: "Axel", message: msg }); //Hur vet den vem som skickar? Genom någon slags token?
    newMessage.save();
    io.emit("message", msg);
  });
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
