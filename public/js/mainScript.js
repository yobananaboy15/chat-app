const chatForm = document.getElementById("chat-form");
const messageContainer = document.getElementById("message-container");
const usersContainer = document.getElementById('online-container')

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

socket.on('userStatusChange', (usersData) => {

  //Remove duplicates 
  let arrayOfUsers = Object.entries(usersData).map(element => element[1].username)
  let filteredArray = arrayOfUsers.filter((val, index) => arrayOfUsers.indexOf(val) === index)

  while (usersContainer.firstChild) {
    usersContainer.removeChild(usersContainer.firstChild)
  }  
  for (user of filteredArray){
    const element = document.createElement("p");
    newContent = document.createTextNode(user);
    element.append(newContent);
    usersContainer.append(element);
    }
})

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
