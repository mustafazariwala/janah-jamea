const express = require("express");
const compression = require('compression')
const bodyParser = require("body-parser");
var enforce = require('express-sslify');
const cors = require('cors')
const path = require('path')
const mongoose = require("mongoose");

const userRoutes = require('./routes/users')
const uploadRoutes = require('./routes/uploads')

require('dotenv').config()


const app = express();
// app.use(cors())
// app.use(enforce.HTTPS({ trustProtoHeader: true }))
app.use(compression())

mongoose
  .connect(
    process.env.DB_NAME,
    { useNewUrlParser: true , useUnifiedTopology: true}
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch((error) => {
    console.log(error, "Connection failed!");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use("/assets/images", express.static(path.join(__dirname, "images")))
app.use("/", express.static(path.join(__dirname, "angular")))
app.use("/", express.static(path.join(__dirname, "static")))




app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "*"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "*"
  );
  next();
});

app.use("/api/user",userRoutes);
app.use("/api/upload",uploadRoutes);
app.use((req,res,next)=> {
  res.sendFile(path.join(__dirname ,"angular", "index.html"))
})


module.exports = app;
