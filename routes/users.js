const express = require('express');
const User = require('../model/user');
var jwt = require('jsonwebtoken');
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
    User.findOne({its: userData.its}, (err, user) => {
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
                    its: user.its
                })
            }
        }
    })
})

// Fetch Data for Profile 

router.get('/profile/:its', (req,res)=> {
    User.findOne({its: req.params.its}, (err, user) => {
        res.status(200).send(user)
    })
})

router.get('/allusers', (req,res)=> {
    console.log('All users')
    User.find({}, (err, result)=> {
        console.log(result)
        res.status(200).send({
            message: 'All users data',
            result: result
        })
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
      "participation": [],
      "accesslevel": {
          "code": '',
          "darajah": 1
      }
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


module.exports = router