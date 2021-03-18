const chatForm = document.getElementById("chat-form");
const messageContainer = document.getElementById("message-container");
const privateMessageContainer = document.getElementById('private-msg-container') 
const usersContainer = document.getElementById('online-container2')
const channelForm = document.getElementById('channel-form')

//Establish connection to the socket

const socket = io();

socket.on("chatMessage", (message) => {
  const element = document.createElement("p");
  if(message.avatar){

    function toBase64(arr) {
      //arr = new Uint8Array(arr) if it's an ArrayBuffer
      return btoa(
         arr.reduce((data, byte) => data + String.fromCharCode(byte), '')
      );
   }
    let int8array = new Uint8Array(message.avatar.data)
    const imageStr = toBase64(int8array)

    const avatar = document.createElement('img')
    avatar.src=`data:${message.avatar.contentType};base64,${imageStr}`
    avatar.classList.add('avatar');
    element.append(avatar)
  }

  newContent = document.createTextNode(
    message.username + ": " + message.message
  );
  element.append(newContent);
  messageContainer.append(element);
});

socket.on('channelAdded', newChannel => {
  if(newChannel.private) {
    const p = document.createElement("p")
    const a = document.createElement("a")
    const link = document.createTextNode(newChannel.channelname);
    a.append(link)
    a.href = `/chat/${newChannel._id}`
    p.append(a)
    privateMessageContainer.append(p)
  }

})

//Redircts the user
socket.on('redirect', (url) => {
  window.location.href = url
})

socket.on('userStatusChange', (usersData) => {

  //Remove duplicates 
  let arrayOfUsers = Object.entries(usersData).map(element => element[1].username)
  let filteredArray = arrayOfUsers.filter((val, index) => arrayOfUsers.indexOf(val) === index)

  while (usersContainer.firstChild) {
    usersContainer.removeChild(usersContainer.firstChild)
  } 

  for (user of filteredArray){
    const element = document.createElement("p");
    const PM = document.createElement('span')
    PM.append(document.createTextNode(user))
    element.append(PM)
    usersContainer.append(element);
    }

    //Lägg till eventlistener på alla som emittar
    document.querySelectorAll('p span').forEach(element => {
      element.addEventListener('click', e =>{
        socket.emit('startPM', e.target.textContent)
      }) 
    })
})

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = e.target.elements.msg.value;
  socket.emit("chatMessage", msg);
  e.target.elements.msg.value = "";
});

channelForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const newChannel = e.target.elements.channel.value;
  socket.emit("addChannel", newChannel);
  e.target.elements.channel.value = "";
});


