import multer from 'multer'
import jwt from 'jsonwebtoken'
import User from "../models/users.js"
import path from 'path'
import fs from 'fs';
// import { fileURLToPath } from "url";
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);


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