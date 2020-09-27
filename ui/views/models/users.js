var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

//Our schema definition
var UsersSchema = new mongoose.Schema({
    username: String,
    password: String
});

// Import the additional functionality of passport into our schema
UsersSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UsersSchema);