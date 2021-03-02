import Messages from "../models/messages.js";

export const renderChat = async (req, res, next) => {
  const data = await Messages.find(); //Det här ska vara en controllerfunktion
  //Gör ett anrop till databasen för att få de existerande posterna i databasen. Skicka dem till EJS-templatet.
  //När någon postar ett nytt meddelande, lägg till det i databasen, och kör en emit på meddelandet till alla som redan är anslutna.
  //Data om vilken channel
  res.render("index.ejs", { messages: data });
};
