'use strict';

const   express 				    = require("express")
	    , http					    = require('http')
        , request					= require("request")
        , qs                        = require(`querystring`)
        , bodyParser 				= require("body-parser")
        , User 					    = require("./views/models/user")
        , passport 				    = require("passport")
        , LocalStrategy 			= require("passport-local")
        , passportLocalMongoose 	= require("passport-local-mongoose")

// add timestamps in front of log messages
require('console-stamp')(console, 'HH:MM:ss.l');

// Constants
const DEFAULT_PORT = 5000;
const DEFAULT_HOST = '0.0.0.0';
const SERVER_DEFAULT_PORT = 8080;
const SERVER_DEFAULT_HOST = 'server';

const port = process.env.PORT || DEFAULT_PORT;
const host = process.env.HOST || DEFAULT_HOST;
const serverPort = process.env.SERVER_PORT || SERVER_DEFAULT_PORT;
const serverHost = process.env.SERVER_HOST || SERVER_DEFAULT_HOST;


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

//====================
// ROUTES
//====================

// This is a test route using for checking the connection between Server and UI.
app.get("/test", (request, response) => {
    console.log("Checking UI test page");
    // Perform a GET request on the server.
    http.get(`http://${serverHost}:${serverPort}/test`, (res) => {
        res.setEncoding(`utf8`);
        var body = '';

        res.on(`data`, (chunk) => {
            //console.log(`Body: ${chunk}`);
            body += chunk;
        });

        res.on(`end`, () => {
            // var data = JSON.parse(body); // for JSON text
            // var data = qs.parse(body); // for HTML page
            var data = body; // for plain text
            console.log(`Data: ${data}`);
            response.send(data);
        });

    }).on(`error`, (error) => {
        return console.log(`SERVER /test GET ERROR: ${error}`);
    });

}).on(`error`, (error) => {
    return console.log(`UI /test GET ERROR: ${error}`);
});

app.get("/", (req, res) => {
    res.render("home");
    console.log("Checking UI root page");
});

app.get("/secret", isLoggedIn, (req, res) => {
    res.render("secret");
    console.log("Checking UI secret page");
});

// AUTHENTICATION Routes
// Render Sign Up form
app.get("/register", (req, res) => {
    res.render("register");
    console.log("Checking UI Register page");
});
//User Sign Up handling
app.post("/register", (req, res) => {
    console.log("UI: Registering...");
    req.body.username
    req.body.password
    User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
        //in case of error throw error msg and redirect to Sign Up page
        if(err){
            console.log(err);
            return res.render("register");
        }
        //log the user in, encode the data (using local strategy) and redirect to Secret page
        passport.authenticate("local")(req, res, () => {
            res.redirect("/login");
        });
    });
});

//LOGIN ROUTES
// Render Log In form
app.get("/login", (req, res) => {
    res.render("login");
});
//User Log In handling
app.post("/login", passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login"
}), (req, res) => {
});

//LOGOUT ROUTE
app.get("/logout", (req, res) => {
    req.logout();
    console.log("UI: Logging out and redirecting to root ...");
    res.redirect("/");
});

//SEARCH ROUTE
app.get("/search", (req, res) => {
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

//====================
// Run the applicatin
//====================

app.listen(port, host);
console.log(`Running on http://${host}:${port}`);