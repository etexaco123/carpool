'use strict';

const   express 				    = require("express")
        , enableWs                  = require('express-ws')
        , http                      = require("http")
        , url                       = require("url")
        , cors                      = require("cors")
        , mongoose 				    = require("mongoose")
        , bodyParser 			    = require("body-parser")
        , cassandra                 = require("cassandra-driver")

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
const DEFAULT_MONGODB_HOST = `mongodb-seed`;
const DEFAULT_MONGODB_PORT = `27017`;
const DEFAULT_MONGODB_USERNAME = `root`;
const DEFAULT_MONGODB_PASSWORD = `rootpass`;
const DEFAULT_MONGODB_RS_NAME = `wacc-rs`;

const DEFAULT_CASSANDRADB_HOST = `cassandra-seed`;
const DEFAULT_CASSANDRADB_PORT = `9042`;
const DEFAULT_CASSANDRADB_USERNAME = `root`;
const DEFAULT_CASSANDRADB_PASSWORD = `rootpass`;
const DEFAULT_CASSANDRADB_KEYSPACE = `wacc`;

const port = process.env.PORT || DEFAULT_PORT;
const host = process.env.HOST || DEFAULT_HOST;

// Mongodb setup
async function connectMongoDB() {
    console.log(`Trying to connect to MongoDB ...`);
        
    const mongodbHost = process.env.MONGODB_HOST || DEFAULT_MONGODB_HOST
    const mongodbPort = process.env.MONGODB_PORT || DEFAULT_MONGODB_PORT
    const mongodbName = process.env.MONGODB_NAME || DEFAULT_MONGODB_NAME
    const username = process.env.MONGODB_USERNAME || DEFAULT_MONGODB_USERNAME
    const password = process.env.MONGODB_PASSWORD || DEFAULT_MONGODB_PASSWORD
    const rsName = process.env.MONGODB_RS_NAME || DEFAULT_MONGODB_RS_NAME
    const uri = `mongodb://${username}:${password}@${mongodbHost}:${mongodbPort}/?replicaSet=${rsName}`;

    //Set up the connection to the db
    mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
        dbName: mongodbName
    })
    .then(() => console.log('Connected to MongoDB!'))
    .catch(error => console.log(`Error connecting to Mongodb: ${error.message}`));
}

// Cassandra setup
async function connectCassandraDB() {
    console.log(`Trying to connect to CassandraDB ...`);

    const username = process.env.CASSANDRADB_USERNAME || DEFAULT_CASSANDRADB_USERNAME
    const password = process.env.CASSANDRADB_PASSWORD || DEFAULT_CASSANDRADB_PASSWORD
    const cassandradbKeyspace = process.env.CASSANDRADB_KEYSPACE || DEFAULT_CASSANDRADB_KEYSPACE
    const cassandraHost = process.env.CASSANDRADB_HOST || DEFAULT_CASSANDRADB_HOST
    const cassandraPort = process.env.CASSANDRADB_PORT || DEFAULT_CASSANDRADB_PORT
    const uri = `${cassandraHost}:${cassandraPort}`; 

    var authProvider = new cassandra.auth.PlainTextAuthProvider(username, password);
    var contactPoints = [uri]; // Note: There can be more, useful for clusters
    var client = new cassandra.Client({contactPoints: contactPoints, authProvider: authProvider, keyspace: cassandradbKeyspace});
    client.connect()
    .then(() => console.log('Connected to CassandraDB!'))
    .catch(error => console.log(`Error connecting to CassandraDB: ${error.message}`));


    //console.log('Connected to CassandraDB!');
    console.log('TODO: CassandraDB is incomlete!');

    console.log(`- username: ${username}`);
    console.log(`- password: ${password}`);
    console.log(`- cassandradbKeyspace: ${cassandradbKeyspace}`);
    console.log(`- cassandraHost: ${cassandraHost}`);
    console.log(`- cassandraPort: ${cassandraPort}`);
    console.log(`- uri: ${uri}`);

    // //   Prepare test query
    // const query = 'SELECT name, email FROM users WHERE key = ?';
    // client.execute(query, [ 'someone' ])
    //     .then(result => console.log('User with email %s', result.rows[0].email)); 

    // // Another test query
    // const query = "SELECT name, email, birthdate FROM users WHERE key = 'mick-jagger'";
    // client.execute(query, function (err, result) {
    //     var user = result.first();
    //     //The row is an Object with column names as property keys. 
    //     console.log('My name is %s and my email is %s', user.name, user.email);
    // });
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
//Needed for posting data into a request
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
//required method to use express-session
app.use(require("express-session")({
    secret: "group6 is the best",
    resave: false,
    saveUninitialized: false
}));

// Enable websockets
const wsInstance = enableWs(app)

//====================
// ROUTES
//====================

// Websocket route(s)
app.ws('/chat', (ws, req) => {
    const wss = wsInstance.getWss();
    ws.on('message', (msgObj) => {
        console.log('')
        const { type, client_id, name, msg } = JSON.parse(msgObj);
        if (type == "connect") {
            console.log(`New connection from: ${client_id}`)
            wss.clients.forEach(function each(client) {
                // Add id if it doesn't exist
                if (!client.id) client.id = client_id
            });
        } else {
            console.log(`Received message from: ${name}`)
            console.log(`Message: ${msg}`)
            console.log(`Broadcasting...`)
            const newMessage = `{"name": "${name}", "msg": "${msg}"}`
            wss.clients.forEach(function each(client) {
                if (client.readyState === 1) { // if it's OPEN
                    console.log(` - Sending message to client: ${client.id}`)
                    client.send(newMessage);
                }
            });
            console.log(`Message broadcasted successfully to all clients!`)
        }
    });

    ws.on('close', () => {
        console.log('WebSocket was closed')
    });

    ws.on('error', (error) => {
        console.log(`Websockets error: ${error}`);
    });
});

// This is a test route using for checking the connection between Server and UI.
app.get("/test", async (req, res) => {
    console.log("Checking Server Test page");
    var payload = `Testing Server connection! [TIME: ${getDateTime()}]`
    res.send(payload);
});

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

app.get("/drivers", async (req, res) => {
    console.log(`Fetching Drivers on the Server side [TIME: ${getDateTime()}]`);
    if (mongoose.connection.readyState == 0) {
        return res.status(500).send('No DB connection!');
    } else if(mongoose.connection.readyState == 2 || 
              mongoose.connection.readyState == 3) {
        return res.status(503).send('MongoDB connection is yet initialized. Try again in a few moments. ');
    }

    // Retrieve the documents as quick as possible, use "lean"
    Drivers.find().lean().exec((err, drivers) => {
        if (err) return res.status(500).send(err)
        res.status(200).send(drivers)
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

    const user = new Users({
        employee_id: req.body.employee_id,
        password: req.body.password
    });
    user.save((err) => {
        console.log(`Inserting data into Mongodb ...`);
        if (err) return res.status(500).send(err);
        console.log(`... User added successfully`);
    });

    var message = `User ${user.employee_id} created successfully!`
    res.status(201).send(message)
});
app.post("/employees", (req, res) => {
    console.log("Server: Registering...");
    if (mongoose.connection.readyState == 0) {
        return res.status(500).send('No DB connection!');
    } else if(mongoose.connection.readyState == 2 || 
              mongoose.connection.readyState == 3) {
        return res.status(503).send('MongoDB connection is yet initialized. Try again in a few moments. ');
    }

    const employee = new Employees({
        employee_id: req.body.employee_id,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        address: req.body.address,
        job_title: req.body.job_title,
        age: req.body.age,
        driver_license: req.body.driver_license
    });
    employee.save((err) => {
        console.log(`Inserting data into Mongodb ...`);
        if (err) return res.status(500).send(err);
        console.log(`... Employee added successfully`);
    });

    var message = `Employee ${employee.employee_id} added successfully!`
    res.status(201).send(message)
});
app.post("/drivers", (req, res) => {
    console.log("Server: Registering...");
    if (mongoose.connection.readyState == 0) {
        return res.status(500).send('No DB connection!');
    } else if(mongoose.connection.readyState == 2 || 
              mongoose.connection.readyState == 3) {
        return res.status(503).send('MongoDB connection is yet initialized. Try again in a few moments. ');
    }

    const driver = new Drivers({
        employee_id: req.body.employee_id,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        car_model: req.body.car_model,
        car_image_id: req.body.car_image_id
    });
    driver.save((err) => {
        console.log(`Inserting data into Mongodb ...`);
        if (err) return res.status(500).send(err);
        console.log(`... Driver added successfully`);
    });

    var message = `Driver ${driver.employee_id} added successfully!`
    res.status(201).send(message)
});



//====================
// Run the applicatin
//====================

app.listen(port, host);

// Run MongoDB
connectMongoDB().catch(console.error);

// Run Cassandra
connectCassandraDB().catch(console.error);

console.log(`Running on http://${host}:${port}`);
