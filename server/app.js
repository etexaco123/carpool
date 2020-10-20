'use strict';

const { TIMEOUT } = require("dns");
const   express 				    = require("express")
        , session                   = require("express-session")
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
const DEFAULT_CASSANDRADB_DATACENTER = `datacenter1`;

const port = process.env.PORT || DEFAULT_PORT;
const host = process.env.HOST || DEFAULT_HOST;

//SESSION related constants
const SESSION_NAME = 'sid';
const ONE_HOUR = 1000 * 60 * 60;
const SESSION_LIFETIME = new Date(Date.now() + ONE_HOUR);
const SESSION_SECRET =  'wacc-grp6';

const cassandradbKeyspace = process.env.CASSANDRADB_KEYSPACE || DEFAULT_CASSANDRADB_KEYSPACE

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
var cassandraClient = null;
async function connectCassandraDB() {
    console.log(`Trying to connect to CassandraDB ...`);

    const username = process.env.CASSANDRADB_USERNAME || DEFAULT_CASSANDRADB_USERNAME
    const password = process.env.CASSANDRADB_PASSWORD || DEFAULT_CASSANDRADB_PASSWORD
    const cassandradbDatacenter = process.env.CASSANDRADB_DATACENTER || DEFAULT_CASSANDRADB_DATACENTER
    const cassandraHost = process.env.CASSANDRADB_HOST || DEFAULT_CASSANDRADB_HOST
    const cassandraPort = process.env.CASSANDRADB_PORT || DEFAULT_CASSANDRADB_PORT
    const uri = `${cassandraHost}:${cassandraPort}`; 

    const authProvider = new cassandra.auth.PlainTextAuthProvider(username, password);
    const contactPoints = [uri]; // Note: There can be more, useful for clusters
    cassandraClient = new cassandra.Client({contactPoints: contactPoints, authProvider: authProvider, keyspace: cassandradbKeyspace, localDataCenter: cassandradbDatacenter});
    
    // The explicit connection is not required, but docs suggest it nonetheless
    cassandraClient.connect()
        .then(() => console.log('Connected to CassandraDB!'))
        .catch(error => console.log(`Error connecting to CassandraDB: ${error.message}`));

    // // Dummy query
    // const query = 'SELECT * from wacc.locations';
    // cassandraClient.execute(query)
    //     .then(result => console.log(result))
    //     .catch(error => console.log(`CassandraDB query ERROR: ${error.message}`));
}

// Format the time.
function getDateTime() {
    return new Date().toISOString().replace('T', ' ').substr(0, 19);
}
   


//run express
var app = express();
// Cors
app.use(cors({
    origin: [
        'http://localhost:8080',
        'https://localhost:8080'
      ],
      credentials: true,
      exposedHeaders: ['set-cookie']
}));
//Needed to be able to run contents of public dir like css file
app.use(express.static("public"));
//Needed for posting data into a request
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
//required method to use express-session
app.use(session({
    name: SESSION_NAME,
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: SESSION_LIFETIME,
        sameSite: true,
        secure: false
    }
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
// app.ws('/location', (ws, req) => {
//     const wss = wsInstance.getWss();
//     ws.on('message', (msgObj) => {
//         console.log('')
//         const { type, client_id, name, msg } = JSON.parse(msgObj);
//         if (type == "connect") {
//             console.log(`New connection from: ${client_id}`)
//             wss.clients.forEach(function each(client) {
//                 // Add id if it doesn't exist
//                 if (!client.id) client.id = client_id
//             });
//         } else {
//             console.log(`Received message from: ${name}`)
//             console.log(`Message: ${msg}`)
//             console.log(`Broadcasting...`)
//             const newMessage = `{"name": "${name}", "msg": "${msg}"}`
//             wss.clients.forEach(function each(client) {
//                 if (client.readyState === 1) { // if it's OPEN
//                     console.log(` - Sending message to client: ${client.id}`)
//                     client.send(newMessage);
//                 }
//             });
//             console.log(`Message broadcasted successfully to all clients!`)
//         }
//     });

//     ws.on('close', () => {
//         console.log('WebSocket was closed')
//     });

//     ws.on('error', (error) => {
//         console.log(`Websockets error: ${error}`);
//     });
// });

// This is a test route using for checking the connection between Server and UI.
app.get("/test", (req, res) => {
    console.log("Checking Server Test page");
    console.log(`Cookie-Session:`);
    console.log(req.session);
    var payload = `Testing Server connection! [TIME: ${getDateTime()}]`
    res.status(200).send(payload);
});

app.get("/", (req, res) => {
    console.log("Checking Server root page");
    res.render("home");
});

// Routes to retrieve users data from the MongoDB
app.get("/users", (req, res) => {
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
app.get("/employees", (req, res) => {
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
app.get("/drivers", (req, res) => {
    console.log(`Fetching Drivers on the Server side [TIME: ${getDateTime()}]`);
    if (mongoose.connection.readyState == 0) {
        return res.status(500).send('No MongoDB connection!');
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

// CassandraDB Locations query
app.get("/locations", (req, res) => {
    console.log(`Fetching Locations on the Server side [TIME: ${getDateTime()}]`);
    if (!cassandraClient) return res.status(500).send('No CassandraDB connection!');

    // Prepare the query
    const query = `SELECT * from ${cassandradbKeyspace}.locations`;
    cassandraClient.execute(query)
        .then(result => {
            return res.status(200).send(result.rows);
        })
        .catch(error => {
            console.log(`CassandraDB query ERROR: ${error.message}`)
            return res.status(500).send(error);
        });
});

// Register users data
app.post("/users", (req, res) => {
    console.log("Server: Registering user...");
    if (mongoose.connection.readyState == 0) {
        return res.status(500).send('No DB connection!');
    } else if(mongoose.connection.readyState == 2 || 
              mongoose.connection.readyState == 3) {
        return res.status(503).send('MongoDB connection is yet initialized. Try again in a few moments. ');
    }

    const user = new Users({
        employee_id: req.body.employee_id,
        password: req.body.password,
        role: req.body.role
    });
    user.save((err) => {
        if (err) return res.status(500).send(err);
    });

    var message = `User ${user.employee_id} created successfully! (Role: ${user.role})`
    console.log(message);
    return res.status(201).send(message)
});
app.post("/employees", (req, res) => {
    console.log("Server: Registering employee...");
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
        is_driver: req.body.is_driver
    });
    employee.save((err) => {
        if (err) return res.status(500).send(err);
        console.log(`... Employee added successfully`);
    });

    var message = `Employee ${employee.employee_id} added successfully!`
    return res.status(201).send(message)
});
app.post("/drivers", (req, res) => {
    console.log("Server: Registering driver...");
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
        car_make: req.body.car_make,
        car_image_id: req.body.car_image_id
    });
    driver.save((err) => {
        if (err) return res.status(500).send(err);
        console.log(`... Driver added successfully`);
    });

    var message = `Driver ${driver.employee_id} added successfully!`
    return res.status(201).send(message)
});

// User Log in handling
app.post("/login", async (req, res) => {
    console.log(`Logging in a user on Server side [TIME: ${getDateTime()}]`);
    var payload = {
        error: false,
        message: "",
        data: {}
    }
    
    if (mongoose.connection.readyState == 0) {
        payload.message = "No MongoDB connection!"
        payload.error = true
        return res.status(500).send(payload);
    } else if(mongoose.connection.readyState == 2 ||
              mongoose.connection.readyState == 3) {
        payload.message = "MongoDB connection is yet initialized. Try again in a few moments."
        payload.error = true
        return res.status(503).send(payload);
    }

    try{
        const {employee_id, password} = req.body
        const user = await Users.findOne({
            employee_id: employee_id,
            password: password
        })
        if (!user) {
            payload.message = "Incorrect login information";
            payload.error = true
            return res.status(403).send(payload)
        }
        payload.message = `User ${user.employee_id} logged in successfully! (Role: ${user.role})`
        payload.data.employee_id = user.employee_id
        //payload.data.password = user.password  // Don't send the password as payload!
        payload.data.role = user.role

        // Fetch the user's data from the Employees and Drivers db's
        const employee = await Employees.findOne({
            employee_id: payload.data.employee_id
        })
        if (!employee) {
            // Return current data
            console.log(`No employee information for user: ${payload.data.employee_id}`)
            return res.status(201).send(payload)
        }
        payload.data.first_name = employee.first_name
        payload.data.last_name = employee.last_name
        payload.data.address = employee.address
        payload.data.job_title = employee.job_title
        payload.data.email = employee.email
        payload.data.age = employee.age
        payload.data.is_driver = employee.is_driver

        // Check if the employee is also a driver
        if ("is_driver" in payload.data)
        {
            const driver = await Drivers.findOne({
                employee_id: payload.data.employee_id
            })
            if (!driver) {
                // Return current data
                console.log(`No driver information for user ${payload.data.employee_id}`)
                return res.status(201).send(payload)
            }
            payload.data.car_make = driver.car_make
            payload.data.car_image_id = driver.car_image_id
        } else {
            console.log(`User ${payload.data.employee_id} is not a driver!`)
        }
    } catch (err) {
        payload.error = true
        payload.message = "An error has occured trying to log in"
        return res.status(500).send(payload)
    }

    console.log(payload.message)
    req.session.payload = payload
    req.session.save()
    return res.status(201).send(payload)

});

//Logout handling
app.get('/logout', function(req, res){
    req.session.destroy();
    console.log("Logout on the server side");
    res.status(201).send("Logged out..");
});

// Capture unimplemented routes.
app.get('*', function(req, res){
    res.status(404).send('Page does not exist!');
});


//====================
// Run the application
//====================


app.listen(port, host);


// Run MongoDB
connectMongoDB().catch(console.error);

// Run Cassandra
connectCassandraDB().catch(console.error);

console.log(`Running on http://${host}:${port}`);
