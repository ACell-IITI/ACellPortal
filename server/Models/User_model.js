const mongoose = require("mongoose");

//Alumni model
const AlumniSchema = new mongoose.Schema({

    AlumniEmail:{
        type: String,
        required: true
    },
    AlumniPassword:{
        type: String,
        required: true
    }
},{timestamps: true});


//Admin model
const AdminSchema = new mongoose.Schema({
    AdminEmail:{
        type: String,
        requried: true
    },
    AdminPassword:{
        tyoe: String,
        required: true
    }
});


const Alumni_db = mongoose.model("Alumni_db",AlumniSchema)
const Admin_db = mongoose.model("Admin_db",AdminSchema)

module.exports = {Alumni_db, Admin_db}