const chatForm = document.getElementById("chat-form");
const messageContainer = document.getElementById("message-container");

//Establish connection to the socket

const socket = io();

socket.on("message", (message) => {
  const element = document.createElement("p");
  newContent = document.createTextNode(message);
  element.append(newContent);
  messageContainer.append(element);
});

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const msg = e.target.elements.msg.value;
  socket.emit("chatMessage", msg);
  e.target.elements.msg.value = "";
  //Gör om detta till fetch och kör en post-request, nej bättre att ha det så här så att man inte måste göra databas-anrop hela tiden.
});
