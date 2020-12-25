const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    email: {type: String, unique: true},
    its: {type: Number, unique: true},
    password: {type: String},
    class: {type: Number},
    dateJoined: {type: Date, default: Date.now()}
})

module.exports = mongoose.model('User', userSchema)