const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    branch: {type: String},
    darajah: {type: Number},
    accesslevel: {
        code: { type: Number, default: 1},
        darajah : { type: Number }
    },
    its: {type: Number, unique: true},
    trno: {type: Number, unique: true},
    name: {type: String},
    nameAR: {type: String},
    age: {type: Number},
    mobile: {type: Number},
    email: {type: String, unique: true},
    password: {type: String, default: '12345'},
    gender: {type: String},
    hizb: {type: String},
    watan: {type : String},
    muqaam: {type: String},
    // eventParticipation: [
    //     {
    //         eventName: {type: String},
    //         eventId: {type: mongoose.ObjectId},
    //         fileUrl: {type: String},
    //         isChecked: {type: Boolean},
    //         ratings: {type: Number},
    //         comments: {type: String}
    //     }
    // ]

})

module.exports = mongoose.model('User', userSchema)