//////////////////requiring and using all npm modules////////////////
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose"); //don't need to require passport-local

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(session({
  secret: "Any long string in here.",//save to .env file
  resave: false,
  saveUninitialized: false
}));

//starting and using passport package on express-sessions
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.set('useCreateIndex', true);

//mongo Schema and model

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

userSchema.plugin(passportLocalMongoose); //to hash and salt passwords behind scenes

const User = new mongoose.model("User", userSchema);

//these will create cookie sessions and read throught them with passport-local-mongoose package
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", function(req, res) {
  res.render("home");
});

/////////////////////////////////////LOGIN PAGE/////////////////////////////////////
app.route("/login")

  .get(function(req, res) {
    res.render("login");
  })

  .post(function(req, res) {

    const user = new User ({
      username: req.body.username,
      password: req.body.password
    });

  req.login(user, function(err){
    if(err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function(){
        res.redirect("/secrets");
      });
    }
   });
  });



////////////////////////////////////REGISTER PAGE////////////////////////////////
app.route("/register")

  .get(function(req, res) {
    res.render("register");
  })

  .post(function(req, res) {

    User.register({username: req.body.username}, req.body.password, function(err, user){
      if(err){
        console.log(err);
        res.redirect("/register")
      } else {
        //authenticating and setting up a logged-in session for the user
        passport.authenticate("local")(req, res, function(){
          res.redirect("/secrets");
        });
      }
    });
  });

/////////////////////////////////////LOGOUT ROUTE/////////////////////////////////////

app.get("/logout", function(req, res){
  req.logout();
  res.redirect("/");
});

/////////////////////////////////////SECRETS PAGE/////////////////////////////////////
app.get("/secrets", function(req, res){
  //checking whether the user is authenticated (passport-local-mongoose package)
  if (req.isAuthenticated()) {
    res.render("secrets");
  } else {
    res.redirect("/login");
  }
});








app.listen(3000, function() {
  console.log("This server is running on port 3000!")
});
