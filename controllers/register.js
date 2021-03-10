import Users from "../models/users.js"
import bcrypt from 'bcrypt';

export const renderRegisterForm = (req, res) => {
    res.render('register.ejs')
}

export const handleRegister = async (req, res, next) => {
    let errors = [];
    const {username, password, password2} = req.body;
    if(!username || !password || !password2) {
        errors.push({msg : "Please fill in all fields."})
    }

    if(password !== password2) {
        errors.push({msg : "Passwords don't match."});
    }

    if(password.length < 6 ) {
        errors.push({msg : 'Password must be at least 6 characters.'})
    }

    if(errors.length > 0 ) {
        return res.render('register', {
            errors,
            username,
            password,
            password2
        })
    }

    const user = await Users.findOne({username: req.body.username})
    if(user){
        errors.push({msg: "Username already taken."})
        return res.render('register', {errors, username, password, password2})
    }
    next();
}

export const addUser = async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const newUser = new Users({username: req.body.username, password: hashedPassword})
        await newUser.save();
        res.redirect("/login")
    } catch (error) {
        res.status(500).send()
    }
}



