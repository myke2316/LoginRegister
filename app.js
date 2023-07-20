const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose')
const encrypt = require('mongoose-encryption')
require('dotenv').config()

const app = express();

//connection for mongoose
mongoose.connect('mongodb://localhost:27017/userDB');

const userSchema = new mongoose.Schema({
  email:String,
  password:String
})

//encryption
const secret = process.env.SECRET
userSchema.plugin(encrypt, { secret: secret , encryptedFields:["password"]});


const User = mongoose.model('User', userSchema)
//=================================================
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("Home");
});

//LOGIN========================
app.get("/login", (req, res) => {
  res.render("Login");
});

app.post('/login', (req,res)=>{
  let email = req.body.username
  let password = req.body.password

  User.findOne({email:email}).then((value) => {
    if(value){
      if(value.password === password){
        res.render('secrets');
        console.log("correct")
      }else{
        res.redirect('/login')
        console.log('wrong')
      }
    }
  })
})
//===================================================

//LOGOUT and SUBMIT==============

app.get('/logout', (req,res) => {
  res.redirect('/')
})

app.post('/logout', (req,res) => {
  res.redirect('/')
})

//===================================================

//REGISTER=======================
app.get("/register", (req, res) => {
  res.render("Register");
});

app.post('/register' , (req,res) => {
  let email = req.body.username
  let password = req.body.password

  const user = new User({
    email:email,
    password:password
  })
  user.save();
  res.render('secrets')
})
//====================================================


app.listen("3000");
