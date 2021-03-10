//Importera moduler som behövs.
import jwt from "jsonwebtoken";
import Users from "../models/users.js";
import bcrypt from "bcrypt";

export const renderLoginPage = (req, res, next) => {
  res.render("login.ejs");
};

export const handleLogin = async (req, res) => {
  const userData = { username: req.body.username, password: req.body.password };
  //Check if password and username matches
  const user = await Users.findOne({ username: userData.username });
  if (!user) {
    return res.render("login.ejs", { error: "Wrong username or password" });
  }
  try {
    if(await bcrypt.compare(userData.password, user.password)){
      const token = jwt.sign(
        { _id: user._id, username: user.username },
        process.env.ACCESS_TOKEN, {expiresIn: '7d'}
      );
      res.cookie("token", token, {
        expires: new Date(Date.now() + 604800000),
        httpOnly: true,
      });
      res.redirect("/chat");
    } else {
      return res.render("login.ejs", { error: "Wrong username or password" });
    }
  } catch (error) {
    
  }


  //If username and password matches, send a cookie with JWT token.
};