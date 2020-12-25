const express = require('express');
var multer  = require('multer');
var path = require('path')



const router = express.Router();


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
  })
   
var upload = multer({ storage: storage })
// var upload = multer({ dest: 'uploads/' })


router.post('/file', upload.single('file'), (req,res,next)=> {
    const file = req.file;
    console.log(file);
    if(!file){
        const error = new Error('Please Upload a file');
        error.httpStatusCode = 400;
        return next(error)
    }
    res.send(file)
})
   


module.exports = router
