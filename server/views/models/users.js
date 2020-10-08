var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

//Our schema definition
var UsersSchema = new mongoose.Schema({
    employee_id: String,
    password: String
}, {collection: "Users"});

// Import the additional functionality of passport into our schema
UsersSchema.plugin(passportLocalMongoose, {
  usernameField: "employee_id"
});

module.exports = mongoose.model("Users", UsersSchema);