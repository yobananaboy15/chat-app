const loginButton = document.getElementById("login-btn");
const url = "http://localhost:5000";

//Make POST request to recieve JWT.

function getJWT(userInfo) {
  return fetch(`${url}/login`, {
    method: "POST",
    body: JSON.stringify(userInfo),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.redirectURL) {
        window.location.href = data.redirectURL;
      } else {
        displayError(data);
      }
    });
}

function displayError(error) {
  const body = document.getElementById("body");
  const element = document.createElement("p");
  newContent = document.createTextNode(error);
  element.append(newContent);
  body.append(element);
}

//Add eventlistener to login button to get JWT and then login user.

loginButton.addEventListener("click", async (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  //Jag kanske kan kolla här om det finns en JWT redan?
  getJWT({ username, password });
});
