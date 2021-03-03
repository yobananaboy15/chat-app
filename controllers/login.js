//Importera moduler som behövs.
import jwt from "jsonwebtoken";
import Users from "../models/users.js";

export const renderLoginPage = (req, res, next) => {
  res.render("login.ejs");
};

export const handleLogin = async (req, res) => {
  const userData = { username: req.body.username, password: req.body.password };
  //Check if password and username matches
  const user = await Users.findOne({ username: userData.username });
  if (!user) {
    res.render("login.ejs", { error: "Wrong username or password" });
  }
  if (!user.password === userData.password) {
    res.render("login.ejs", { error: "Wrong username or password" });
  }
  //If username and password matches, send a cookie with JWT token.
  const token = jwt.sign(
    { _id: user._id, username: user.username },
    process.env.ACCESS_TOKEN
  );
  res.cookie("token", token, {
    expires: new Date(Date.now() + 900000),
    httpOnly: true,
  });
  res.redirect("/chat");
};

// } else {
//   res.render("login.ejs", { error: "Wrong username or password" });
// }
