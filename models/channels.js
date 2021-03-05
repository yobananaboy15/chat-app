import mongoose from "mongoose";

const channelSchema = mongoose.Schema({
  channelname: String,
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
  private: Boolean,
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User"}]
});

const Channels = mongoose.model("Channel", channelSchema);

export default Channels;
