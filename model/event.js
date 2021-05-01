const mongoose = require('mongoose');
const eventSchema = mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    dateAdded: {type: Date, default: new Date()},
    dateExpiry: {type: Date},
    participants: [
       {
          participantsId: {type: mongoose.ObjectId},
       }
    ],
    count: {type: Number}
})

module.exports = mongoose.model('Event', eventSchema)