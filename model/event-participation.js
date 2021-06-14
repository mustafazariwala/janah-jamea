const mongoose = require('mongoose');
const eventParticipationSchema = mongoose.Schema({
    participantId: {type: mongoose.ObjectId, ref: 'User'},
    eventId: {type: mongoose.ObjectId, ref: 'Task'},
    datePerformed: {type: Date, default: new Date()},
    fileUrl: {type: String, required: true},
    totalMarks: {type: Number},
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