'use strict';

const   express 				    = require("express")
        , http                      = require("http")
        , url                       = require("url")
        , cors                      = require("cors")
        , mongoose 				    = require("mongoose")
        , bodyParser 			    = require("body-parser")
        , passport 				    = require("passport")
        , LocalStrategy 			= require("passport-local")
        , passportLocalMongoose 	= require("passport-local-mongoose")

// Load Mongo schemas
const   Users 					    = require("./views/models/users")
        , Employees		            = require("./views/models/employees")
        , Drivers		            = require("./views/models/drivers")

// add timestamps in front of log messages
require('console-stamp')(console, 'HH:MM:ss.l');

// Constants
const DEFAULT_PORT = 5050;
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

//var Employees = null

// Mongodb setup
async function connectMongodb() {
    console.log(`Trying to connect to Mongodb ...`);

    const username = process.env.MONGODB_USERNAME || DEFAULT_MONGODB_USERNAME
    const password = process.env.MONGODB_PASSWORD || DEFAULT_MONGODB_PASSWORD
    const uri = `mongodb://${username}:${password}@${mongodbHost}:${mongodbPort}/`;

    //Set up the connection to the db
    mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
        dbName: mongodbName
    }).then((MongooseNode) => {
        console.log('Connected to DB!');
        
        // /* Use the default nativeConnection object since my connection object uses a single hostname and port.
        //    Iterate here if you work with multiple hostnames in the connection object */
        // const nativeConnection =  MongooseNode.connections[0]
        // const nativeConnection = mongoose.connection

        // // Show collections
        // console.log('Showing current collections...')
        // nativeConnection.db.listCollections().toArray((error, names) => {
        //     if (error) {
        //         throw new Error(error);
        //     } else {
        //         names.forEach((elem, idx, aarr) => {
        //             console.log(`Collection: ${elem.name}`);
        //         });
        //     }
        // });

        // // Show documents from collection 'Employees'
        // console.log('Showing documents form collection Employees')
        // //Employees = nativeConnection.db.collection('Employees')
        // Employees.find({}, (err, results) => {
        //     if (err) throw err;
        //     results.forEach((elem, idx, arr) => {
        //         console.log(`Elem: ${idx}`)
        //         console.log(`Elem first_name: ${elem.first_name}`)
        //         console.log(`Elem last_name: ${elem.last_name}`)
        //         console.log(`Elem address: ${elem.address}`)
        //         console.log(`Elem job_title: ${elem.job_title}`)
        //         console.log(`Elem age: ${elem.age}`)
        //     })
        // })

    }).catch(error => console.log(`Error connecting to Mongodb: ${error.message}`));

}

// Format the time.
function getDateTime() {
    return new Date().toISOString().replace('T', ' ').substr(0, 19);
}


//run express
var app = express();
// Cors
app.use(cors());
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
//Required methods to be able to use passport mongoose plugin
app.use(passport.initialize());
app.use(passport.session());
//Use passport's local strategy for user authentication
passport.use(new LocalStrategy(Users.authenticate()));
//Use the passport's methods for encoding and decoding the data of our sessions
passport.serializeUser(Users.serializeUser());
passport.deserializeUser(Users.deserializeUser());

//====================
// ROUTES
//====================

// This is a test route using for checking the connection between Server and UI.
app.get("/test", async (req, res) => {
    console.log("Checking Server Test page");
    var payload = `Testing Server connection! [TIME: ${getDateTime()}]`
    res.send(payload);
})

app.get("/", (req, res) => {
    console.log("Checking Server root page");
    res.render("home");
});

app.get("/users", async (req, res) => {
    console.log(`Fetching Users on the Server side [TIME: ${getDateTime()}]`);
    if (mongoose.connection.readyState == 0) {
        return res.status(500).send('No DB connection!');
    } else if(mongoose.connection.readyState == 2 || 
              mongoose.connection.readyState == 3) {
        return res.status(503).send('MongoDB connection is yet initialized. Try again in a few moments. ');
    }

    // Retrieve the documents as quick as possible, use "lean"
    Users.find().lean().exec((err, users) => {
        if (err) return res.status(500).send(err)
        res.status(200).send(users)
    });
});

app.get("/employees", async (req, res) => {
    console.log(`Fetching Employees on the Server side [TIME: ${getDateTime()}]`);
    if (mongoose.connection.readyState == 0) {
        return res.status(500).send('No DB connection!');
    } else if(mongoose.connection.readyState == 2 || 
              mongoose.connection.readyState == 3) {
        return res.status(503).send('MongoDB connection is yet initialized. Try again in a few moments. ');
    }

    // Retrieve the documents as quick as possible, use "lean"
    Employees.find().lean().exec((err, employees) => {
        if (err) return res.status(500).send(err)
        res.status(200).send(employees)
    })

});

//User Sign Up handling
app.post("/register", (req, res) => {
    console.log("Server: Registering...");
    if (mongoose.connection.readyState == 0) {
        return res.status(500).send('No DB connection!');
    } else if(mongoose.connection.readyState == 2 || 
              mongoose.connection.readyState == 3) {
        return res.status(503).send('MongoDB connection is yet initialized. Try again in a few moments. ');
    }

    var user = new Users({
        employee_id: req.body.employee_id,
        password: req.body.password
    })
    user.save((err) => {
        console.log(`Inserting data into Mongodb ...`);
        if (err) return res.status(500).send(err);
        console.log(`... User added successfully`);
    });

    res.status(201).send({"message:":"created"})
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