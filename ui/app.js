'use strict';

var express 				= require("express"),
	https					= require('https'),
	request					= require("request"),
    bodyParser 				= require("body-parser"),
    User 					= require("./views/models/user")


// Constants
const PORT = 5000;
const HOST = '0.0.0.0';



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


// USE HTTP GET/POST REQUESTS

// Connect UI to the server.
// Communicate asynchronously.

//==============
//ROUTES
//==============

app.get("/", function(req, res){
    res.render("home");
});

app.get("/secret", isLoggedIn, function(req, res){
    res.render("secret");
});

// AUTHENTICATION Routes
// Render Sign Up form
app.get("/register", function(req, res){
    res.render("register");
});
//User Sign Up handling
app.post("/register", function(req, res){
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


app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);