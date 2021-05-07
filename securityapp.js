//////////////////requiring and using all npm modules////////////////

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5"); //hashing function for passwords

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

//mongo Schema and model

const userSchema = new mongoose.Schema ({
  email: String,
  password: String
});

const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res){
  res.render("home");
});

app.route("/login")

.get(function(req, res){
  res.render("login");
})

.post(function(req, res){
  const username = req.body.username;
  const password = md5(req.body.password); // using the md5 hashing function on the password field

  User.findOne({email: username}, function(err, foundUser){
    if(err){
      console.log(err);
    }else{
      if(foundUser){
        if(foundUser.password === password){
          res.render("secrets");
        }else{
          res.send("Wrong password!");
        }
      }else{
        res.send("Wrong username!");
      }
    }
  });
});



////////////////////////REGISTER PAGE///////////////////////
app.route("/register")

.get(function(req, res){
  res.render("register");
})

.post(function(req, res){

 const newUser = new User ({
   email: req.body.username,
   password: md5(req.body.password) // using the md5 hashing function on the password field
 });

 newUser.save(function(err){
   if (err){
     console.log(err);
   }else{
     res.render("secrets");
   };
 });
});









app.listen(3000, function(){
  console.log("This server is running on port 3000!")
});
