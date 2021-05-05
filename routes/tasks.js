const express = require('express');
const Task = require('../model/task');
// const TaskParticipation = require('../model/task-participation');
const checkAuth = require('../middleware/check-auth');
const multer = require('multer');
const path = require('path');
const User = require('../model/user');
const taskParticipation = require('../model/task-participation');
// const event = require('../model/task');


const router = express.Router();


var taskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
  })
   


// Add Task

router.post('/addtask', (req,res)=> {

    let task = new Task({
        title: req.body.title,
        tagline: req.body.tagline,
        catagory: req.body.catagory,
        language: req.body.language,
        description: req.body.description,
        dateAdded: req.body.dateAdded,
        dateExpiry: req.body.dateExpiry,
    })
    // console.log(req.body)

    // Add Task 
    task.save().then(result => {
        res.status(200).send({
            message: `${result.title} Task Added Successfully`
        })
        
    }).catch(error => {
        res.status(400).send({
            message: 'Task Added has been failed. Contact administrator if this problem persists.'
        })
    })

})

// get all events 


router.get('/gettasks',(req,res)=> {

    Task.find({}).then(result => {
        // console.log(result)
        res.status(200).send(result)
    })
})

// Get Single Event 

router.get('/gettask/:id', (req,res)=> {
    Task.findById(req.params.id).then(result => {
        res.status(200).send(result)
    })
})


// Participate in Task

router.post('/participate', 
// multer({storage: taskStorage}).single("file"),
 (req,res)=> {

    if(!req.file){
        return res.status(403).send({
            message: 'The request does not contain a file'
        })
    }

    const url = req.protocol + '://' + req.get("host");

    let data = {
        taskId: req.body.taskId,
        participantId: req.body.participantId
    }
    
    taskParticipation.findOneAndUpdate({taskId: '609184b6e1d72d21f4056909', participantsId:'609183f928f48b52a0d4860c'},{upsert: true})
    .then(err, result => {
        // console.log(result)
        // console.log(err)
    })
    // Task.find({'_id': data.taskId,'participants.participantsId': data.participantsId}, 'participants._id')
    // .then(result => {
    //     // console.log(result)
    //     if(result.length == 0){
    //        console.log('Not Participated') 

    //     //    Add User Id in Task 
    //     //    Task.findOneAndUpdate({'_id': data.taskId}, {$push : {participants: {participantsId: data.participantsId}}})
    //     //    .then(result => res.send(result)).catch(error => res.send(error))

    //     //    Add complete task is User 
    //     //    User.findByIdAndUpdate(data.participantsId, {$push: {taskParticipation: {taskId: data.taskId, fileUrl: '124.mp3'}}})
    //     //    .then(result => res.send(result)).catch(error => res.send(error))

    //     }else{
    //        res.send('Participated Already') 
    //     }
    // })
})


router.post('/saveaudio', multer({storage: taskStorage}).single("file"),(req,res)=> {
    if(!req.file){
        return res.status(403).send({
            message: 'The request does not contain a file'
        })
    }
    let TaskParticipation = new taskParticipation({
        taskId: req.body.taskId,
        participantId: req.body.userId,
        fileUrl: req.file.filename,
        public: req.body.isPublic,
    })

    console.log(req.body)
    
    taskParticipation.find({taskId: req.body.taskId, participantId: req.body.userId}, 'taskId').then(result => {
        if(result.length != 0){
            return res.status(400).send({message: 'User Cannot participate'})
        }
        
        res.status(200).send({message: 'User has Successfully participated'})
        TaskParticipation.save()
    })

    // taskParticipation.insertMany(data)
    // user.findOneAndUpdate({_id: req.body.userId}, {
    //     $push : { participation: data}
    // }).then( result => {

    //     event.findOneAndUpdate({_id: req.body.eventId}, {$push : {participants: {participantsId: req.body.userId}}})
    //     .then(result => console.log(result))

    //     res.status(200).send({
    //         message: 'Succesfully registered in the event',
    //         result: result
    //     })
    // }).catch( error => { 
    //     console.log('error' + error)
    // })

    // console.log(req.file)
})
router.get('/gettaskslist', (req,res)=> {
    console.log('Hi')
    Task.find({}, 'title catagory language').then(result => {
        res.status(200).send(result)
    })
})

router.post('/getparticipatedtask', (req,res)=> {
    taskParticipation.find(req.body).then(result => {
        res.status(200).send(result)
    }).catch(error => {
        res.status(400).send(error)
    })
})

let TaskParticipation = new taskParticipation({
    taskId: '6091b56041afed2354173d43',
    participantId: '609183f928f48b52a0d4860e',
    datePerformed: new Date(),
    fileUrl: 'dasdsad',
    public: true
})


let data = {
    taskId: '6091b56041afed2354173d43',
    participantId: '609183f928f48b52a0d4860e',
    datePerformed: new Date(),
    
}


// taskParticipation.findOneAndUpdate({taskId: data.taskId, participantId: data.participantId}, data, {upsert: true})
//     .then(result => {
//         console.log({
//             message: 'File Saved',
//             result: result
//         })
//         // console.log(err) 
//     })
//     .catch(error => {
//         console.log({
//             message: 'Error',
//             error: error
//         })
//     })

// taskParticipation.find({taskId: data.taskId, participantId: data.participantId}, 'taskId').then(result => {
//     if(result.length != 0){
//         return console.log('The user has already participated')
//     }
    
//     console.log("The User has sucessfully participated")
//     TaskParticipation.save()
// })


module.exports = router