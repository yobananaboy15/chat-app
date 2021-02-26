const mongoose = require("mongoose");

//Eventuellt behövs koppling till kanalid.
const messageSchema = mongoose.Schema({
  user: String,
  message: String,
});

const Messages = mongoose.model("Messages", messageSchema);

module.exports = Messages;
