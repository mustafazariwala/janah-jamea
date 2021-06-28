const express = require('express');
const ohbatVideo = require('../model/ashara/ohbat-video');
const OhbatVideo = require('../model/ashara/ohbat-video');

const router = express.Router();

router.post('/ohbat-video/add', (req,res)=> {

    let ohbatVideo = new OhbatVideo({
        title: req.body.title,
        hijriDate: req.body.hijriDate,
        engDate: req.body.engDate,
        videoId: req.body.videoId
    })
    
    ohbatVideo.save().then(result => {
        res.status(200).send({
            message: 'The Video has been added to Ashara Ohbat section'
        })
    })
})


router.get('/ohbat-video/getAll', (req,res)=> {
    ohbatVideo.find({}).sort({engDate: -1}).then(result => {
        res.status(200).send(result)
    })
})



module.exports = router
