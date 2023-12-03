const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

var app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:true}));
app.use('/public',express.static('public'));

mongoose.connect("mongodb://127.0.0.1:27017/secrets");
const trySchema = new mongoose.Schema({
    email: String,
    password: String
});
const User = mongoose.model("second", trySchema);

const userSecret = new mongoose.Schema({
    secret : String
});
const item = mongoose.model("first", userSecret);

app.get("/", function(req, res){
    res.render("home");
});

app.post("/register", async function(req, res){
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({
            email: req.body.username,
            password: hashedPassword
        });
        await newUser.save();
        res.render("secrets");
    } catch (err) {
        console.log(err);
    }   
    
});

app.post("/login", async function(req,res){
    try {
        const username = req.body.username;
        const password = req.body.password;
        const foundUser = await User.findOne({ email: username });
    
        if (foundUser) {
            const passwordMatch = await bcrypt.compare(password, foundUser.password);
            if (passwordMatch) {
                res.render("secrets");
            } 
            else {
                console.log("Incorrect password");
            }
        } 
        else {
            console.log("User not found");
        }
    } 
    catch (err) {
        console.log(err);
    }
});

app.post("/submit", function(req, res){
    const newSecret = new item({
        secret : req.body.secret
    });
    newSecret.save();
    res.redirect("/");
});

app.get("/login", function(req, res){
    res.render("login");
});
app.get("/register", function(req, res){
    res.render("register");
});

app.get("/submit", function(req, res){
    res.render("submit");
});

app.listen(4000, function(){
    console.log("Server started");
});