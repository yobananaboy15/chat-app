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
      localStorage.setItem("jwt", data);
      login();
    });
}

//Send get request with JWT token

function login() {
  const token = localStorage.getItem("jwt");
  fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then((res) =>
    res.json().then((data) => {
      if (data.redirectURL) {
        window.location.href = res.redirectURL;
      }
    })
  );
}

//Add eventlistener to login button to get JWT and then login user.

loginButton.addEventListener("click", async (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  //Jag kanske kan kolla här om det finns en JWT redan?
  getJWT({ username, password });
});
