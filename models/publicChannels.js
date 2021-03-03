import mongoose from "mongoose";

const publicChannelSchema = mongoose.Schema({
  name: String,
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
});

const Channels = mongoose.Model("PublicChannel", publicChannelSchema);

export default Channels;
