const express = require('express');
const Event = require('../model/event');
const EventParticipation = require('../model/event-participation');
const checkAuth = require('../middleware/check-auth');
const multer = require('multer');
const path = require('path');
const user = require('../model/user');
const eventParticipation = require('../model/event-participation');
// const event = require('../model/event');


const router = express.Router();

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/events')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
  })
   

router.post('/getevents', checkAuth,(req,res)=> {
    let male = false;
    user.findOne({_id: req.body.id}, 'gender accesslevel darajah').then(result => {
        let adminAccess = result.accesslevel.includes('root')
        if(result.gender == 'M' && !adminAccess){
            male = true;
        }
        query = {}
        if(!adminAccess){
            class1 = `darajah.${result.darajah}`
            query[class1] = true
        }
        Event.find(query).then(result => {
            console.log(result)
            if(male){
                result = result.filter(element => element.gender.male ==  true)
                // console.log(result)
            }
            res.status(200).send(result)
        })
    })
    
})

router.post('/addevent', (req,res)=> {
//    console.log(req.body)
   let event = new Event(req.body)
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

router.post('/deleteevent', (req,res)=> {
    console.log(req.body)
    Event.deleteOne({_id: req.body.id}).then(result => {
        res.status(200).send({
            message: 'Event Deleted',
            result: result
        })
    }).catch(error => {
        res.status(400).send({
            message: 'Event Not Deleted'
        })
    })
})

router.post('/updateevent/:id', (req,res)=> {
    console.log('Update event')
    Event.updateOne({_id: req.params.id}, req.body).then(result => {
        res.status(200).send({
            message: 'Event Updated',
            result: result
        })
    }).catch(error => {
        res.status(400).send({
            message: 'Event Not Updated'
        })
    })
    // Event.findByIdAndUpdate()
})

router.post('/saveaudio', multer({storage: storage}).single("file"),(req,res)=> {
    console.log(req.body)
    if(!req.file){
        return res.status(403).send({
            message: 'The request does not contain a file'
        })
    }
    // const url = req.protocol + '://' + req.get("host");

    let eventParticipation = new EventParticipation({
        eventId: req.body.eventId,
        participantId: req.body.userId,
        fileUrl: req.file.filename,
        isChecked: false,
    })

    // console.log(req.file)
    

    EventParticipation.find({eventId: req.body.eventId, participantId:  req.body.userId}, 'eventId').then(result => {
        if(result.length != 0){
            return res.status(400).send({message: 'User has already been participated. Cannot participate multiple time'})
            // return console.log('User Cannot participate')
            
        }
        // console.log('User can Participate')
        eventParticipation.save().then(result => {
            res.status(200).send({message: 'User has Successfully participated'})
        })
    })
   
})

router.post('/searcheventparticipation', (req,res)=> {
    // console.log(req.body)
    Promise.all([    
        EventParticipation.find({eventId: req.body.eventId, 'assessment.isAssigned': false}, 'participantId assessment').populate('participantId', 'name trno its age email').exec(),
        EventParticipation.find({eventId: req.body.eventId, 'assessment.isAssigned': true}, 'participantId assessment').populate('participantId assessment.checkedBy', 'name trno its age email').exec()
    ]).then(result => {
       res.status(200).send(result)
    })
})

router.post('/assignevaluator', (req,res)=> {
    payload = {
        assessment: {
            date: new Date(),
            checkedBy: req.body.assessment.checkedBy,
            isAssigned: true
        },
    }
    EventParticipation.updateMany({_id: { $in: req.body.participantId}}, payload, { upsert: true }).then(result => {
        // console.log(result)
        res.status(200).send({
            message: result.n + ' has been assigned'
        })
        user.find({'_id': req.body.assessment.checkedBy, accesslevel: 'evaluation'}).then(result => {
            if (result.length) {
                // console.log(result.length)
                return
            }
            user.updateOne({'_id' : req.body.assessment.checkedBy}, {$push:  {'accesslevel': 'evaluation'}}).then(result => {
                // console.log('Updated')
        
            })
        })
    })
});



router.post('/removeevaluator', (req,res)=> {
    // console.log(req.body)
    EventParticipation.updateOne( {_id: req.body.id}, {assessment: {isAssigned: false}}).then(result => {
        // console.log(result)
        if(result.n > 0){
            return res.status(200).send({
                message: 'Assignment has been removed succesfully'
            })
        }else{
            return res.status(500).send({
                message:  'Assignment cannot be removed'
            })
        }
        
    })
})

router.get('/geteventslist', (req,res)=> {
    Event.find({}, 'title totalmarks rubrics').then(result => {
        res.status(200).send(result)
    })
})

router.post('/evaluation/getparticipants', (req,res)=> {
    // console.log(req.body)
    EventParticipation.find({eventId: req.body.eventId, 'assessment.isAssigned': true, 'assessment.checkedBy': req.body.evaluatorId, 'rubrics.0': { "$exists": false}}, 'participantId fileUrl')
    .populate('participantId', 'name its').then( result => {
        res.status(200).send(result)
    })
})

router.post('/evaluation/getevaluate', (req,res)=> {
    // console.log(req.body)
    EventParticipation.updateOne({_id: req.body.id}, {'rubrics': req.body.rubrics}).then(result => {
        console.log('Evaluation Done', result)
        if(!result){
            return res.status(400).send('Evaluation cannot be processed')
        }
        res.status(200).send({message: 'Evaluation completed'})

    })
})

router.post('/evaluation/getDate', (req,res)=> {
    let male = false;
    user.findOne({_id: req.body.id}, 'gender accesslevel darajah').then(result => {
        let adminAccess = result.accesslevel.includes('root')
        if(result.gender == 'M' && !adminAccess){
            male = true;
        }
        query = {}
        if(!adminAccess){
            let gender; 
            class1 = `darajah.${result.darajah}`
            
            query[class1] = true
            if(result.gender == 'M'){gender = `gender.male`}
            if(result.gender == 'F'){gender = `gender.female`}
            query[gender] = true
        }
        console.log(result)
        console.log('Gender', query)
        Event.find(query, 'title dateAdded dateExpiry gender').then(result => {
            // console.log(result)
            if(male){
                result = result.filter(element => element.gender.male ==  true)
            }
            let output = result.map( element => { 
                return {
                    id: element._id,
                    title: element.title,
                    date: element.dateAdded,
                    allDay: true
                    // end: element.dateAdded.setDate(element.dateAdded.getDate() + 2)
                }
            })
            res.status(200).send(output)
        })
    })
})

router.get('/getallparticipation/:id', (req,res)=> {
    EventParticipation.find({eventId: req.params.id}, 'assessment datePerformed participantId fileUrl rubrics' )
    .populate('assessment.checkedBy', 'name darajah')
    .populate('participantId', 'name darajah trno')
    .then(result => {
        res.status(200).send(result)
    })
    .catch(error => {
        res.status(400).send({
            message: 'Error fetching Event Participations'
        })
    })
})

router.get('/deleteparticipation/:id', (req,res)=> {
    EventParticipation.deleteOne({_id: req.params.id})
    .then(result => {
        res.status(200).send(result)
    })
    .catch(error => {
        res.status(400).send({
            message: 'Error Deleting Participation'
        })
    })
})

var data = [{
    assessment : {
        isAssigned : false
    },
    datePerformed : "2021-07-09T00:48:40.261Z",
    eventId: "60d2f0104d15d891f3a7f960",
    participantId : "60c852faafa1fc2cd00a175d",
    fileUrl: "file-1625803245794.mp3",
    rubrics : [],
    type: {
        registration: true,
        audio: false
    }
}]

// let eventParticipationSave = new EventParticipation(
//     {
//         assessment : {
//             isAssigned : false
//         },
//         datePerformed : "2021-07-09T00:48:40.261Z",
//         eventId: "60d2f0104d15d891f3a7f960",
//         participantId : "60c852faafa1fc2cd00a175d",
//         fileUrl: "file-1625803245794.mp3",
//         rubrics : [],
//         type: {
//             registration: true,
//             audio: false
//         }
//     }
// )
// eventParticipationSave.save().then(result => {
//     console.log(result)
// })



// EventParticipation.updateOne( {_id: id}, {assessment: {isAssigned: false}}).then(result => {
//     console.log(result)
// })


// user.find({name: {'$regex' : 'Mustafa', '$options' : 'i'}}, '_id').then(result => {
//     console.log(result)
//     EventParticipation.find({eventId: '60a8e0894921134390e53649', _id: }).then(result1 => {
//         console.log(result1)
//     })
// })

// EventParticipation.updateMany({}, {assessment: {isAssigned: false}}).then(result => {
//     console.log(result)
// })

// event.save().then(result => console.log(result))

// EventParticipation.find({eventId: '60a8e0894921134390e53649', 'assessment.isAssigned': true}, 'participantId assessment').populate('participantId assessment.checkedBy', 'name trno its age email').then( result => {
//     console.log(result[0].assessment.checkedBy)
// })

// EventParticipation.find({'assessment.checkedBy': '609183f928f48b52a0d4860b'}, 'participantId fileUrl').populate('participantId', 'name').then(result => {
//     console.log(result)
// })
// Event.findById('60a8e0894921134390e53649', '-_id rubrics').then(result => {
//     console.log(result)
// })
// let rubrics = [
//     { description: 'Ahkaam', totalMarks: 33, earnedMarks: 22 },
//     { description: 'Makharij', totalMarks: 33, earnedMarks: 22 },
//     { description: 'Hifz', totalMarks: 33, earnedMarks: 22 }
//   ]

// EventParticipation.findByIdAndUpdate('60ae48f11bc8e43ab0b485d6', {'rubrics': rubrics}).then(result => {
//     console.log(result)
// })
        


module.exports = router
