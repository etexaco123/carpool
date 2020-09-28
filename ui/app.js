'use strict';

const   express 				    = require("express")
        , http					    = require('http')
        , phin                      = require('phin')
        , bodyParser 				= require("body-parser")

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
app.use(bodyParser.json());
//required method to use express-session
app.use(require("express-session")({
    secret: "group6 is the best",
    resave: false,
    saveUninitialized: false
}));

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
            //console.log(`Data: ${data}`);
            response.send(data);
        });

    }).on(`error`, (error) => {
        return console.log(`SERVER /test GET ERROR: ${error}`);
    });

}).on(`error`, (error) => {
    return console.log(`UI /test GET ERROR: ${error}`);
});

// Show Employees
// This is a test route using for checking the connection between the UI, Server and MongoDB.
app.get("/employees", async (request, response) => {
    console.log("Checking UI Employees page");
    // Perform a GET request on the server.
    http.get(`http://${serverHost}:${serverPort}/employees`, (res) => {
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
            //console.log(`Data: ${data}`);
            response.send(data);
        });

    }).on(`error`, (error) => {
        return console.log(`SERVER /employees GET ERROR: ${error}`);
    });

}).on(`error`, (error) => {
    return console.log(`UI /employees GET ERROR: ${error}`);
});

// Show Users
// This is a test route using for checking the connection between the UI, Server and MongoDB.
app.get("/users", async (request, response) => {
    console.log("Checking UI Users page");
    // Perform a GET request on the server.
    http.get(`http://${serverHost}:${serverPort}/users`, (res) => {
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
            //console.log(`Data: ${data}`);
            response.send(data);
        });

    }).on(`error`, (error) => {
        return console.log(`SERVER /users GET ERROR: ${error}`);
    });

}).on(`error`, (error) => {
    return console.log(`UI /users GET ERROR: ${error}`);
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
app.post("/register", async (req, res) => {
    console.log("UI: Registering...");
    console.log(`Username: ${req.body.username}`);
    console.log(`Password: ${req.body.password}`);
    
    // Ensure data is secure, password is hashed
    // TODO: HASH PASSWORD
    

    // Send POST to the server
    // http.post(`http://${serverHost}:${serverPort}/register`, (res) => {
    //     res.setEncoding(`utf8`);
    //     var body = '';

    // }).on(`error`, (error) => {
    //     return console.log(`SERVER /users GET ERROR: ${error}`);
    // });


    const ppostjson = phin.defaults({
        'method': 'POST',
        'parse': 'json',
        'timeout': 2000
    })
    await ppostjson({
    //await phin({
        url: `http://${serverHost}:${serverPort}/register`,
        data: {
            username: req.body.username,
            password: req.body.password
        }
    }).catch((err) => {
        assert.isNotOk(error,'Promise error');
        done();
    })

});

//LOGIN ROUTES
// Render Log In form
app.get("/login", (req, res) => {
    res.render("login");
});
//User Log In handling
// app.post("/login", passport.authenticate("local", {
//     successRedirect: "/secret",
//     failureRedirect: "/login"
// }), (req, res) => {
// });

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