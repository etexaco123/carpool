'use strict';

const   express 				    = require("express")
        , http                      = require("http")
        , url                       = require("url")
        , mongoose 				    = require("mongoose")
        , bodyParser 			    = require("body-parser")
        , User 					    = require("./views/models/user")
        , passport 				    = require("passport")
        , LocalStrategy 			= require("passport-local")
        , passportLocalMongoose 	= require("passport-local-mongoose")
 //       , concat                  = require('concat-stream')

// add timestamps in front of log messages
require('console-stamp')(console, 'HH:MM:ss.l');

// Constants
const DEFAULT_PORT = 8080;
const DEFAULT_HOST = `0.0.0.0`;
const DEFAULT_MONGODB_NAME = `wacc`
const DEFAULT_MONGODB_HOST = `mongo-seed`;
const DEFAULT_MONGODB_PORT = `27017`;
const DEFAULT_MONGODB_USERNAME = `root`;
const DEFAULT_MONGODB_PASSWORD = `rootpass`;

const mongodbHost = process.env.MONGODB_HOST || DEFAULT_MONGODB_HOST
const mongodbPort = process.env.MONGODB_PORT || DEFAULT_MONGODB_PORT
const mongodbName = process.env.MONGODB_NAME || DEFAULT_MONGODB_NAME

const port = process.env.PORT || DEFAULT_PORT;
const host = process.env.HOST || DEFAULT_HOST;


// Mongodb setup
async function connectMongodb() {
    const username = process.env.MONGODB_USERNAME || DEFAULT_MONGODB_USERNAME
    const password = process.env.MONGODB_PASSWORD || DEFAULT_MONGODB_PASSWORD
    const uri = `mongodb://${username}:${password}@${mongodbHost}:${mongodbPort}/${mongodbName}`;

    //Set up the connection to the db
    mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    }).then((MongooseNode) => {
        console.log('Connected to DB!');
        
        /* Use the default nativeConnection object since my connection object uses a single hostname and port.
           Iterate here if you work with multiple hostnames in the connection object */
        const nativeConnection =  MongooseNode.connections[0]

        console.log(`Got connection: ${nativeConnection}`);

        // Show collections
        nativeConnection.db.collectionNames((error, names) => {
            if (error) {
                throw new Error(error);
            } else {
                console.log(`Found collection ${name}`);
            }
        });

        console.log(`Connecting to Admin and showing databases...`);

        // // Show databases: This requires an Admin user
        // new Admin(nativeConnection.db).listDatabases(function(err, result) {
        //     console.log('listDatabases succeeded');
        //     // database list stored in result.databases
        //     var allDatabases = result.databases;
        //     console.log(allDatabases);
        // });

    }).catch(error => console.log(error.message));

}

// Format the time.
function getDateTime() {
    return new Date().toISOString().replace('T', ' ').substr(0, 19);
}


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
app.get("/test", (req, res) => {
    var payload = `Testing Server connection! [TIME: ${getDateTime()}]`
    res.send(payload);
    console.log("Checking Server Test page");
    
})

app.get("/", (req, res) => {
    res.render("home");
    console.log("Checking Server root page");
});

app.get("/users", (req, res) => {
    User.find({}, (err, users) => {
        if (err) res.status(500).send(error)
            res.status(200).json(users);
    });
    console.log("Fetching Users on the Server side");
});

app.get("/secret", isLoggedIn, (req, res) => {
    res.render("secret");
    console.log("Checking Server secret page");
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
    console.log("Server: Logging out and redirecting to root ...");
    res.redirect("/");
});

//SEARCH ROUTE
app.get("/search", (req, res) => {
    res.render("search");
    console.log("Checking Server search page");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


//// Simple Server, but this may not work properly with sockets.


// // Start the server
// http.createServer((request, response) => {
//     if (request.method == 'POST') {
//         var body = '';
//         request.on('data', (data) => {
//             body += data;
//             // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
//             if (body.length > 1e6) { 
//                 // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
//                 response.status(413);
//                 response.send('Chunk too large!');
//                 request.connection.destroy();
//             }
//         });
//         request.on('end', () => {

//             var data = JSON.parse(body);
//             // use POST
//             console.log(`Data: ${data}`);
            
//         });

//     } else if (request.method == `GET`) {
//         console.log('Server received a GET request!');
//         var resultToSend = `{"Result":"Received test GET request"}`;
//         response.writeHead(200, {"Content-Type": "application/json"});
//         // response.write(data); // You Can Call Response.write Infinite Times BEFORE response.end
//         response.end(resultToSend);
//     }

// }).listen(port)

//====================
// Run the applicatin
//====================

app.listen(port, host);

// Run MongoDB
connectMongodb().catch(console.error);

console.log(`Running on http://${host}:${port}`);