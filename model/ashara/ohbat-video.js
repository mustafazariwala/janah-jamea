const mongoose = require('mongoose');
const ohbatVideo = mongoose.Schema({
    title: {type: String, required: true},
    hijriDate: {type: String, required: true},
    engDate: {type : Date, required: true},
    videoId: {type: String, required: true}
})

module.exports = mongoose.model('OhbatVideo', ohbatVideo)