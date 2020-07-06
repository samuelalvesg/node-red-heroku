var path = require("path");
var http = require('http');
var express = require("express");
var RED = require("node-red");

// Create an Express app
var app = express();

// Add a simple route for static content served from 'public'
app.use("/",express.static("public"));


// Create a server
var server = http.createServer(app);

// Create the settings object - see default settings.js file for other options
var settings = {


    ui: { path: "ui" },
    httpAdminRoot:"/admin",
    httpNodeRoot: "/api",
    adminAuth: {
        type: "credentials",
        users: [{
            username: (process.env.NODE_ADMIN_USER || "admin"),
            password: (process.env.NODE_ADMIN_PASSWORD || "$2a$08$zZWtXTja0fB1pzD4sHCMyOCMYz2Z6dNbM6tl8sJogENOMcxWV9DN."),
            permissions: "*"
        }]
    },
    //httpStatic: path.join(__dirname,"public"),
    //userDir:"/home/nol/.nodered/",


    logging: {
        // Only console logging is currently supported
        console: {
            // Level of logging to be recorded. Options are:
            // fatal - only those errors which make the application unusable should be recorded
            // error - record errors which are deemed fatal for a particular request + fatal errors
            // warn - record problems which are non fatal + errors + fatal errors
            // info - record information about the general running of the application + warn + error + fatal errors
            // debug - record information which is more verbose than info + info + warn + error + fatal errors
            // trace - record very detailed logging + debug + info + warn + error + fatal errors
            // off - turn off all logging (doesn't affect metrics or audit)
            level: "trace",
            // Whether or not to include metric events in the log output
            metrics: false,
            // Whether or not to include audit events in the log output
            audit: false
        }
    },

    editorTheme: {
        projects: {
            // To enable the Projects feature, set this value to true
            enabled: false
        }
    },
    
    credentialSecret: false,
    functionGlobalContext: { require:require }    // enables global context
};

if(process.env.MONGODB_URI) {
settings.storageModule = require("node-red-mongo-storage-plugin");
settings.storageModuleOptions = {        
    mongoUrl: process.env.MONGODB_URI,
    database: process.env.MONGODB_DB,
    //optional
    //set the collection name that the module would be using
    collectionNames:{
        flows: "nodered-flows",
        credentials: "nodered-credentials",
        settings: "nodered-settings",
        sessions: "nodered-sessions"
    }
}
}

// Initialise the runtime with a server and settings
RED.init(server,settings);

// Serve the editor UI from /admin
app.use(settings.httpAdminRoot,RED.httpAdmin);

// Serve the http nodes UI from /api
app.use(settings.httpNodeRoot,RED.httpNode);

server.listen(process.env.PORT || 1880);

// Start the runtime
RED.start();