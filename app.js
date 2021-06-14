const express = require("express");
const compression = require('compression')
const bodyParser = require("body-parser");
var enforce = require('express-sslify');
const cors = require('cors')
const path = require('path')
const mongoose = require("mongoose");

const userRoutes = require('./routes/users')
const uploadRoutes = require('./routes/uploads')
const eventsRoutes = require('./routes/events')
const taskRoutes = require('./routes/tasks')

require('dotenv').config()


const app = express();
app.use(cors())
// app.use(enforce.HTTPS({ trustProtoHeader: true }))
// app.use(compression())

mongoose
  .connect(
    process.env.DB_NAME,
    { 
      useNewUrlParser: true ,
      useUnifiedTopology: true,
      useFindAndModify: false
    }
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch((error) => {
    console.log(error, "Connection failed!");
  });

app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use("/uploads", express.static(path.join(__dirname, "uploads")))
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
app.use("/api/event",eventsRoutes);
app.use("/api/task",taskRoutes);
app.use((req,res,next)=> {
  res.sendFile(path.join(__dirname ,"angular", "index.html"))
})


module.exports = app;
