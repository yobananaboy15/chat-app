import multer from 'multer'
import jwt from 'jsonwebtoken'
import User from "../models/users.js"
import Channels from "../models/channels.js"
import fs from 'fs';
import Users from '../models/users.js';



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/uploads")
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now())
    }
})

export const upload = multer({storage})


export const verifyAccess = (req, res, next) => {
    const accessToken = req.cookies.token;
    if (accessToken === undefined) {
      return res.render("login.ejs", {error: 'Please log in '});
    }
    //Verify token. Kolla om användaren har access till kanalen? 
    jwt.verify(accessToken, process.env.ACCESS_TOKEN, (err, user) => {
      if (err) return res.send(err);
      if(req.params.id !== user._id) return res.redirect('/chat')
      req.user = user;
      next();
    });
  };

export const uploadAvatar = async (req, res, next) => {
    console.log('hej')
    try {
        const newAvatar = fs.readFileSync(process.cwd() + "/public/uploads/" + req.file.filename)
        const user = await User.updateOne({_id: req.user._id}, {$set: {avatar: {data: newAvatar, contentType: "image/jpeg"}}})   
    } catch (error) {
        res.send(error)
    }
    res.redirect(`/settings/${req.user._id}`)
}

export const renderSettings = async (req, res) => {
    const user = await User.findOne({_id: req.user._id})
    res.render("settings.ejs", {user})
}

export const changeUserName = async (req, res) => {

    //Sök i databasen och kolla om det användarnamnet redan finns
    if(!await Users.findOne({username: req.body.newUsername})){
        await Users.updateOne({_id: req.user._id}, {username: req.body.newUsername})
        const token = jwt.sign(
            { _id: req.user._id, username: req.body.newUsername },
            process.env.ACCESS_TOKEN, {expiresIn: '7d'}
          );
          res.cookie("token", token, {
            expires: new Date(Date.now() + 604800000),
            httpOnly: true,
          });

          //Jag gör en post req till settings
          //Verify access och sätter mitt nuvarande namn till req.user


          //Hitta alla privata konversationer och döp om den delen av namnet som
          await Channels.find({users: req.user._id})
          .then(channels => channels.forEach(async channel => {
            //   console.log(channel.channelname)
              channel.channelname = channel.channelname.replace(req.user.username, req.body.newUsername)
              await channel.save()
          }))
          //Ändra den delen av kanalnamnet som 
    }

    const user = await User.findOne({_id: req.user._id})

    res.render("settings.ejs", {user})
} 