const mongoose = require('mongoose');
const taskSchema = mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    tagline: {type: String, required: true},
    catagory: {type: String, required: true},
    language: {type: String, required: true},
    dateAdded: {type: Date, default: new Date()},
    dateExpiry: {type: Date},
})

module.exports = mongoose.model('Task', taskSchema)