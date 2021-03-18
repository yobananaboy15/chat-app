import mongoose from "mongoose";

//Eventuellt behövs koppling till kanalid.
const messageSchema = mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
  message: String,
});


messageSchema.pre('remove', async function() {
  await this.model('Channel').updateOne(
    {}, //Hur vet den att detta är rätt dokument??
    {$pull: {messages: this._id}},
  )
})

const Messages = mongoose.model("Message", messageSchema);

export default Messages;
