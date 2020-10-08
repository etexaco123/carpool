const mongoose = require("mongoose");

//Our schema definition
const DriversSchema = new mongoose.Schema({
    employee_id: String,
    first_name: String,
    last_name: String,
    car_make: String,
    car_image_id: String
}, {collection: "Drivers"});

module.exports = mongoose.model("Drivers", DriversSchema);