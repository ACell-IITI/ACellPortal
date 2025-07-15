const mongoose = require("mongoose");

const MentorSchema = new mongoose.Schema({

    Mentorship_Bio:{
        type: String,
        required: true
    },

    LinkedIn_Id:{
        type: String,
        required: true
    },

    Skills:{
        type: String,
        required: true
    }
},{timestamps: true});


const Mentorship_db = mongoose.model("Mentorship_db",MentorSchema)

module.exports = Mentorship_db;