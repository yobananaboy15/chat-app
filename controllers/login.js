//Importera moduler som behövs.
import jwt from "jsonwebtoken";
import Users from "../models/users.js";

export const renderLoginPage = (req, res, next) => {
  res.render("login.ejs");
};

export const handleLogin = async (req, res) => {
  const userData = { username: req.body.username, password: req.body.password };

  //Check if password and username matches
  if (
    await Users.findOne({
      username: userData.username,
      password: userData.password,
    })
  ) {
    //If username and password matches, send a cookie with JWT token.
    const token = jwt.sign(userData, process.env.ACCESS_TOKEN);
    res.cookie("token", token, {
      expires: new Date(Date.now() + 900000),
      httpOnly: true,
    });
    res.json({ redirectURL: "http://localhost:5000/chat" });
  } else {
    res.json("Incorrect username or password");
  }
};
