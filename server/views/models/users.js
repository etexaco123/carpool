var mongoose = require("mongoose");


//Our schema definition
var UsersSchema = new mongoose.Schema({
    employee_id: String,
    password: String
}, {collection: "Users"});


module.exports = mongoose.model("Users", UsersSchema);