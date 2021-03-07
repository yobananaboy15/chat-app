const chatForm = document.getElementById("chat-form");
const messageContainer = document.getElementById("message-container");

//Establish connection to the socket

const socket = io();

socket.on("chatMessage", (message) => {
  const element = document.createElement("p");
  newContent = document.createTextNode(
    message.username + ": " + message.message
  );
  element.append(newContent);
  messageContainer.append(element);
});

//Redircts the user if there is no valid JWT
socket.on('redirect', (url) => {
  window.location.href = url.url
})

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = e.target.elements.msg.value;
  socket.emit("chatMessage", msg);
  e.target.elements.msg.value = "";
});
