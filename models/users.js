const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: String,
  password: String,
});

const Users = mongoose.model("user", userSchema);

module.exports = Users;
