const mongoose = require("mongoose")

const studentSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    university: {
        type: String,
        required: true
    },
    faculty: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    academicLevel: {
        type: String,
        required: true
    },
    vjudge: {
        type: String,
        default: null
    },
    codeforces: {
        type: String,
        default: null
    },
})

module.exports = mongoose.model('Student', studentSchema)