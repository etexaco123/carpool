const mongoose = require("mongoose");

//Our schema definition
const EmployeesSchema = new mongoose.Schema({
    employee_id: String,
    first_name: String,
    last_name: String,
    address: String,
    job_title: String,
    age: Number,
    username: String
}, {collection: "Employees"});

module.exports = mongoose.model("Employees", EmployeesSchema);