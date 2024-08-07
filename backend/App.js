const express = require('express');
const cors = require('cors');
var bodyParser = require('body-parser');

const taskRoutes = require('./routes/task.js');
const userRoutes = require("./routes/user.js");

const app = express();

//Define types
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Cross origin requests
app.use(cors({
  origin: 'http://localhost:5173',  // Replace actual frontend domain for production
  credentials: true,
}));

app.use((req,res,next) =>{
  req.time = new Date(Date.now()).toString();
  console.log("[*]",req.method,req.hostname, req.path, req.time);
  console.log("\t-Params:", req.params)
  console.log("\t-Body:", req.body )
  console.log("\t-Auth:", req.headers.authorization)
  next();
});

//Routes
app.use("/task", taskRoutes);
app.use("/user", userRoutes);

//Export App for either testing or deployment
module.exports = app;


