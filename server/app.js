'use strict';

var express 				= require("express"),
    http                    = require("http"),
    url                     = require("url"),
    mongoose 				= require("mongoose"),
    MongoClient 			= require("mongodb").MongoClient,
    bodyParser 				= require("body-parser"),
    User 					= require("./views/models/user"),
    passport 				= require("passport"),
    LocalStrategy 			= require("passport-local"),
    passportLocalMongoose 	= require("passport-local-mongoose")


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

// Mongodb setup
async function connectMongodb() {
    const username = process.env.MONGODB_USERNAME || DEFAULT_MONGODB_USERNAME
    const password = process.env.MONGODB_PASSWORD || DEFAULT_MONGODB_PASSWORD
    const uri = `mongodb://${username}:${password}@${mongodbHost}:${mongodbPort}/${mongodbName}`;

    //Set up the connection to the db
    await mongoose.connect(uri, {
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
        nativeConnection.db.collectionNames(function(error, names) {
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

/**
 * Print the names of all available databases
 * @param {MongoClient} client A MongoClient that is connected to a cluster
 */
async function listDatabases(client) {
    databasesList = await client.db().admin().listDatabases();

    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};



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
    console.log("Checking Server root page");
});

app.get("/users", (req, res) => {
    User.find({}, (err, users) => {
        if (err) res.status(500).send(error)
            res.status(200).json(users);
    });
    console.log("Fetching Users on the Server side");
});

app.get("/secret", isLoggedIn, function(req, res){
    res.render("secret");
    console.log("Checking Server secret page");
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
    console.log("Server: Logging out and redirecting to root ...");
    res.redirect("/");
});

//SEARCH ROUTE
app.get("/search", function(req, res){
    res.render("search");
    console.log("Checking Server search page");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


connectMongodb().catch(console.error);

const port = process.env.PORT || DEFAULT_PORT;
const host = process.env.HOST || DEFAULT_HOST;
app.listen(port, host);
console.log(`Running on http://${host}:${port}`);