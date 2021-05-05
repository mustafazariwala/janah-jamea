const express = require('express');
const Event = require('../model/event');
const checkAuth = require('../middleware/check-auth');
const multer = require('multer');
const path = require('path');
const user = require('../model/user');
const event = require('../model/event');


const router = express.Router();

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
  })
   

router.get('/getevents', checkAuth,(req,res)=> {
    Event.find({}).then(result => {
        res.status(200).send(result)
    })
})

router.post('/addevent', (req,res)=> {
    let event = new Event({
        title: req.body.title,
        description: req.body.description,
        dateExpiry: req.body.dateExpiry,
        count: 0
    })
    event.save().then(result => {
        res.status(200).send({
            message: 'Event Saved',
            result: result
        })
    }).catch(error => {
        res.status(400).send({
            message: 'Event Not Saved'
        })
    })
})

router.get('/getevent/:id', (req,res)=> {
    Event.findById(req.params.id).then(result => {
        res.status(200).send({
            message: 'Event Found',
            data: result
        })
    })
})

router.post('/saveaudio', multer({storage: storage}).single("file"),(req,res)=> {
    if(!req.file){
        return res.status(403).send({
            message: 'The request does not contain a file'
        })
    }
    const url = req.protocol + '://' + req.get("host");
    let data = {
        eventName: req.body.title,
        eventId: req.body.eventId,
        fileUrl: url + '/uploads/' + req.file.filename,
        isChecked: false,
        ratings: 0,
        comments: ''
    }
    user.findOneAndUpdate({_id: req.body.userId}, {
        $push : { participation: data}
    }).then( result => {

        event.findOneAndUpdate({_id: req.body.eventId}, {$push : {participants: {participantsId: req.body.userId}}})
        .then(result => console.log(result))

        res.status(200).send({
            message: 'Succesfully registered in the event',
            result: result
        })
    }).catch( error => { 
        console.log('error' + error)
    })

    // console.log(req.file)

   
})


module.exports = router
