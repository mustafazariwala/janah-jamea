const mongoose = require('mongoose');
const eventSchema = mongoose.Schema({
    title: {type: String, required: true},
    tagline: {type: String, required: true},
    catagory: {type: String, required: true},
    type: {
      audio: {type: Boolean},
      registration:  {type: Boolean},
    },
    branch: {
       all: { type: String, required: true },
       karachi: { type: String, required: true },
       surat: { type: String, required: true },
       nairobi: { type: String, required: true },
       marol: { type: String, required: true }
    },
    gender: {
       male: {type: Boolean},
       female: {type: Boolean}
    },
    darajah: {
       1: {type: Number, required: true},
       2: {type: Number, required: true},
       3: {type: Number, required: true},
       4: {type: Number, required: true},
       5: {type: Number, required: true},
       6: {type: Number, required: true},
       7: {type: Number, required: true},
       8: {type: Number, required: true},
       9: {type: Number, required: true},
       10: {type: Number, required: true},
       11: {type: Number, required: true},
       12: {type: Number, required: true},
    },
    description: {type: String, required: true},
    dateAdded: {type: Date},
    dateExpiry: {type: Date},
    totalmarks: {type: Number},
    rubrics: [
       {
          description: {type: String},
          totalMarks: {type: Number},
          _id: false,
       }
    ],
    participants: [
       {
          participantsId: {type: mongoose.ObjectId},
          _id: false,
       }
    ],
    count: {type: Number}
})

module.exports = mongoose.model('Event', eventSchema)