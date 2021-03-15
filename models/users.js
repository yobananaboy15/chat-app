import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  username: String,
  password: String,
  avatar: {data: Buffer, contentType: String}
});

const Users = mongoose.model("User", userSchema);

export default Users;
