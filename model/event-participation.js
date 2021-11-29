const mongoose = require('mongoose');
const eventParticipationSchema = mongoose.Schema({
    participantId: {type: mongoose.ObjectId, ref: 'User'},
    eventId: {type: mongoose.ObjectId, ref: 'Event'},
    datePerformed: {type: Date, default: new Date()},
    fileUrl: {type: String},
    totalMarks: {type: Number},
    type: {
        registration: {type: Boolean},
        audio: {type: Boolean}
    },
    assessment: {
        isAssigned: {type: Boolean, default: false},
        date: {type: Date},
        checkedBy: {type: mongoose.ObjectId, ref: 'User'},
    },
    rubrics: [
        {
            description: {type: String},
            totalMarks: {type: Number},
            earnedMarks: {type: Number},
            _id: false,
            
        }
    ]

})

module.exports = mongoose.model('EventParticipation', eventParticipationSchema)