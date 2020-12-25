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
        if (err){
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
                var token = jwt.sign({ subject: user.id}, 'Janah')
                res.status(200).send({
                    success: true,
                    message: 'Authenticated Successfully',
                    token: token
                })
            }
        }
    })
})

module.exports = router