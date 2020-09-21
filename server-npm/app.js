'use strict';

var express 				= require("express"),
    mongoose 				= require("mongoose"),
    passport 				= require("passport"),
    bodyParser 				= require("body-parser"),
    User 					= require("./views/models/user"),
    LocalStrategy 			= require("passport-local"),
    passportLocalMongoose 	= require("passport-local-mongoose")


// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

//Set up the connection to the db
mongoose.connect(
    'mongodb://mongo:27017/docker-node-mongo', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connected to DB!'))
    .catch(error => console.log(error.message));


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
            return res.render('register');
        }
        //log the user in, encode the data (using local strategy) and redirect to Secret page
        passport.authenticate("local")(req, res, function(){
            res.redirect("/secret");
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

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);