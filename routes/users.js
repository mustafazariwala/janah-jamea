const express = require('express');
const User = require('../model/user');
var jwt = require('jsonwebtoken');
// const user = require('../model/user');
require('dotenv').config()




const router = express.Router();


// userModel.save((err, result)=> {
//     console.log(result)
// })
function verifyToken(req,res,next){
    if(!req.headers.authorization){
        return res.status(401).send({
            message: 'Unauthorized Request'
        })
    }
    let token = req.headers.authorization.split(' ')[1];
    if(token = 'null'){
        return res.status(401).send({
            message: 'Unauthorized Request'
        })
    }
    let payload = jwt.verify(token, 'Janah' )
    if(!payload){
        return res.status(401).send({
            message: 'Unauthorized Request'
        })
    }
    next()
}

router.post('/login', (req,res)=> {
    let userData = req.body;
    console.log(userData)
    User.findOne({its: userData.its},(err, user) => {
        console.log(user)
        if (err){
            console.log(err)
            res.status(401).send({
                success: false,
                message: 'There was some kind of error in API'
            })
        }else {
            if(!user){
                res.status(401).send({
                    success: false,
                    message: 'Incorrect ITS'
                })
            }else if(user.password !== userData.password) {
                res.status(401).send({
                    success: false,
                    message: 'Incorrect Password'
                })
            }else {
                console.log('Authenticated')
                var token = jwt.sign({ subject: user.id}, process.env.SECRET_KEY, {expiresIn: "1h"})
                res.status(200).send({
                    success: true,
                    message: 'Authenticated Successfully',
                    token: token,
                    id: user._id,
                    its: user.its,
                    accesslevel: user.accesslevel
                })
            }
        }
    })
})

// Fetch Data for Profile 

router.get('/profile/:id', (req,res)=> {
    User.findOne({_id: req.params.id}, (err, user) => {
        res.status(200).send(user)
    })
})

router.post('/allusers', (req,res)=> {
    if(req.body.name){
        req.body.name = {'$regex' : req.body.name, '$options' : 'i'}
    }
    console.log(req.body)
    User.find(req.body, 'name email its trno age', (err, result)=> {
        console.log(result)
        res.status(200).send({
            message: 'All users data',
            result: result
        })
    })
})

router.post('/getemailid', (req,res)=> {
    console.log(req.body)
    User.findOne({'its': req.body.its, 'trno': req.body.trno}, '-_id email').then(result => {
        if(!result){
            return res.status(400).send({message: 'An Unknown Error Occurred'})
        }
        res.status(200).send(result)
    })
})

router.post('/updatepassword', (req,res)=> {
    User.updateOne({'its': req.body.its}, {'password': req.body.password}).then(result => {
        if(result.n == 0){
            return res.status(400).send({message: 'An Unknown Error Occurred'})
        }
        res.status(200).send({message: 'Password has been Changed'})
    })
})


var data = [
    {
      "branch": "Karachi",
      "darajah": 1,
      "its": 50493009,
      "trno": 26899,
      "name": "Ummeayman bai Husain bhai Ratlam wala",
      "nameAR": "ام ايمن بائي حسين بهائي رتلام والا",
      "age": 16,
      "mobile": 923462000000,
      "email": "cybercomputer786@gmail.com",
      "gender": "F",
      "hizb": "ورد",
      "watan": "karachi",
      "muqaam": "karachi",
      "password": "12345",
      "accesslevel": {
          "code": '',
          "darajah": 1
      },
      
    },

    {
        "branch": "Karachi",
        "darajah": 11,
        "its": 40492254,
        "trno": 12109,
        "name": "Mulla Mustafa Hussain Zariwala",
        "nameAR": "ام ايمن بائي حسين بهائي رتلام والا",
        "age": 16,
        "mobile": 923462000000,
        "email": "cybercomputer786@gmail.com",
        "gender": "F",
        "hizb": "ورد",
        "watan": "karachi",
        "muqaam": "karachi",
        "password": "12345",
        "accesslevel": {
            "code": '',
            "darajah": 1
        },
      },
    // {
    //   "Branch": "Karachi",
    //   "Darajah": 1,
    //   "ITSID": 40472246,
    //   "TRNO": 26762,
    //   "Name": "Zainab bai Mustansir bhai Colombowala",
    //   "NameAR": "زينب بائي مستنصر بهائي كولمبو والا",
    //   "Age": 14,
    //   "Mobile": 923334000000,
    //   "Email": "mustansir.colombo@gmail.com",
    //   "Gender": "F",
    //   "Hizb": "ياسمين"
    // }
  ]

//   User.insertMany(data)
// var data = { name: 'sds' }



// User.find({watan: {'$regex' : 'karachi', '$options' : 'i'}}, (err, result)=> {
//     console.log('Result ' + result)
//     // console.log
// })


module.exports = router