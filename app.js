const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, "public")));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  //Gör ett anrop till databasen för att få de existerande posterna i databasen. Skicka dem till EJS-templatet.
  //När någon postar ett nytt meddelande, lägg till det i databasen, och kör en emit på meddelandet till alla som redan är anslutna.
  res.render("index.ejs");
});

io.on("connect", (socket) => {
  console.log("new web socket connection");

  socket.emit("message", "Welcome to the chat!");

  socket.broadcast.emit("message", "A user has joined the chat");

  socket.on("disconnect", () => {
    io.emit("message", "A user has left the chat");
  });

  socket.on("chatMessage", (msg) => {
    io.emit("message", msg);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
