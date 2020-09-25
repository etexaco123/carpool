'use strict';

const { Console } = require("console");
var express 				= require("express"),
	https					= require('https'),
	request					= require("request"),
    bodyParser 				= require("body-parser"),
    User 					= require("./views/models/user"),
    passport 				= require("passport"),
    LocalStrategy 			= require("passport-local"),
    passportLocalMongoose 	= require("passport-local-mongoose")


// Constants
const DEFAULT_PORT = 5000;
const DEFAULT_HOST = '0.0.0.0';

//run express
var app = express();
//Needed to be able to run contents of public dir like css file
app.use(express.static("public"));
//Set view engine to be embedded JS
app.set('view engine', 'ejs');
//Needed for posting data into a request
app.use(bodyParser.urlencoded({extended: true}));
//required method to use express-session
app.use(require("express-session")({
    secret: "group6 is the best",
    resave: false,
    saveUninitialized: false
}));
//Required methods to be able to use passport mongoose plugin
app.use(passport.initialize());
app.use(passport.session());
//Use passport's local strategy for user authentication
passport.use(new LocalStrategy(User.authenticate()));
//Use the passport's methods for encoding and decoding the data of our sessions
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// USE HTTP GET/POST REQUESTS

// Connect UI to the server.
// Communicate asynchronously.

//==============
//ROUTES
//==============

app.get("/", function(req, res){
    res.render("home");
    console.log("Checking UI root page");
});

app.get("/secret", isLoggedIn, function(req, res){
    res.render("secret");
    console.log("Checking UI secret page");
});

// AUTHENTICATION Routes
// Render Sign Up form
app.get("/register", function(req, res){
    res.render("register");
    console.log("Checking UI Register page");
});
//User Sign Up handling
app.post("/register", function(req, res){
    console.log("UI: Registering...");
    req.body.username
    req.body.password
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        //in case of error throw error msg and redirect to Sign Up page
        if(err){
            console.log(err);
            return res.render("register");
        }
        //log the user in, encode the data (using local strategy) and redirect to Secret page
        passport.authenticate("local")(req, res, function(){
            res.redirect("/login");
        });
    });
});

//LOGIN ROUTES
// Render Log In form
app.get("/login", function(req, res){
    res.render("login");
});
//User Log In handling
app.post("/login", passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login"
}),     function(req, res){
});

//LOGOUT ROUTE
app.get("/logout", function(req, res){
    req.logout();
    console.log("UI: Logging out and redirecting to root ...");
    res.redirect("/");
});

//SEARCH ROUTE
app.get("/search", function(req, res){
    res.render("search");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


// Example POST
// Registration
//var payload = {"username":"abc", "pass":"a234nk2j34"}
//var resultPOST = app.POST("server:8080/register", payload)
//console.log(`Showing POST result: $(resultPOST)`);


const port = process.env.PORT || DEFAULT_PORT;
const host = process.env.HOST || DEFAULT_HOST;
app.listen(port, host);
console.log(`Running on http://${host}:${port}`);