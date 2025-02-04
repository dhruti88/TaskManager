import express from "express";
import User from "../models/user.js";
//for pwd encryption
import bcrypt from "bcrypt"
//to return token on login
import jwt from "jsonwebtoken";
// Load the Secret Variables  
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

//check user routes
router.get('/hello', (req,res) => {
    res.send('User routes are working')
})

//register a user
router.post('/register', async (req,res) => {
    const { name, email, password } = req.body;
try{
    const user = new User({name, email, password});
    await user.save();
    res.status(201).send({user, message: "User Registered Successfully"});
}
catch(err){
    res.status(400).send({error : err});
}
});



//login a user
router.post('/login', async (req,res) => {
    const {email, password } = req.body;
try{
    const user = await User.findOne({ email });

    if(!user){
        throw new Error('Unable to login, user not found!');
    } 

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
        throw new Error('Incorrect Password!');
    }

    const token = jwt.sign({
        _id : user._id.toString()
    }, process.env.JWT_SECRET_KEY);

    res.status(200).send({user, token, message: "Logged in succesfully!"});
   }
    catch(err){
        res.status(400).send( {error: err.message} );
    }
})

export default router;

