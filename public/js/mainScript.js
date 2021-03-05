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
  url = window.location.href
  fetch(url, {
    method: 'POST',
    body: JSON.stringify({msg}),
    headers: {
      "Content-Type": "application/json"
    }
  })
  //Här kanske jag också göra en POST-request med mitt meddelande genom fetch.
  //Kan jag komma åt urlen här? window.location.href skicka. Ta emot den i 
  socket.emit("chatMessage", msg);
  e.target.elements.msg.value = "";
});
