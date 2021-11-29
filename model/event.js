const mongoose = require('mongoose');
const eventSchema = mongoose.Schema({
    title: {type: String, required: true},
    tagline: {type: String, required: true},
    catagory: {type: String, required: true},
    type: {
      audio: {type: Boolean},
      registration:  {type: Boolean},
      test:  {type: Boolean},
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
       1: {type: Boolean, required: true},
       2: {type: Boolean, required: true},
       3: {type: Boolean, required: true},
       4: {type: Boolean, required: true},
       5: {type: Boolean, required: true},
       6: {type: Boolean, required: true},
       7: {type: Boolean, required: true},
       8: {type: Boolean, required: true},
       9: {type: Boolean, required: true},
       10: {type: Boolean, required: true},
       11: {type: Boolean, required: true},
       12: {type: Boolean, required: true},
    },
    description: {type: String, required: true},
    dateAdded: {type: Date},
    dateExpiry: {type: Date},
    totalmarks: {type: Number},
    rubrics: [
       {
          description: {type: String},
          marks: {type: Number},
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