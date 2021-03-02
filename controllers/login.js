//Importera moduler som behövs.

export const renderLoginPage = (req, res, next) => {
  res.render("login.ejs");
};

export const handleLogin = async (req, res) => {
  const userData = { username: req.body.username, password: req.body.password };
  // console.log(userData);

  //Check if username and password matches in the database. It it does, give a jwt token and send user to the chat
};

// if (
//   await Users.findOne({
//     username: userData.username,
//     password: userData.password,
//   })
// ) {
//   const jwt = generateAccessToken(userData);
//   res.json(jwt);
// }

// function generateAccessToken(userData) {
//   return jwt.sign(userData, process.env.ACCESS_TOKEN);
// }

// function authenticateToken(req, res, next) {
//   const authHeader = req.headers["authorization"]; //Ändra detta till token
//   const token = authHeader && authHeader.split(" ")[1];
//   if (token == null) return res.sendStatus(401);

//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
//     if (err) return res.sendStatus(403);
//     req.user = user;
//     next();
//   });
// }
