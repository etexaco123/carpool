'use strict';

var express = require("express");
var app = express();

app.set("view engine", "ejs");

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

app.get("/", function(req, res){
    res.render("home");
});

app.get("/drivers", function(req, res){
    res.render("drivers");
});

app.get("/employees", function(req, res){
    res.render("employees");
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);