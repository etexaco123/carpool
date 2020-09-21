var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

//Our schema definition
var UserSchema = new mongoose.Schema({
    username: String,
    password: String
});

// Import the additional functionality of passport into our schema
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);