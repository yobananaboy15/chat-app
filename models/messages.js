import mongoose from "mongoose";

//Eventuellt behövs koppling till kanalid.
const messageSchema = mongoose.Schema({
  user: String,
  message: String,
});

//Skapa timestamp

const Messages = mongoose.model("Message", messageSchema);

export default Messages;
