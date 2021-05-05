const mongoose = require('mongoose');
const taskParticipationSchema = mongoose.Schema({
    participantId: {type: mongoose.ObjectId, ref: 'User'},
    taskId: {type: mongoose.ObjectId, ref: 'Task'},
    datePerformed: {type: Date, default: new Date()},
    fileUrl: {type: String, required: true},
    public: {type: Boolean, required: true},
    ratings: [
        {
            stars: {type: Number, required: true},
            comments: {type: String},
            ratingBy:  {type: mongoose.ObjectId, ref: 'User'}
        }
    ]

})

module.exports = mongoose.model('TaskParticipation', taskParticipationSchema)