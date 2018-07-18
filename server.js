const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


//question and quiz model
const questions = require('./routes/api/Questions')
const quiz = require('./routes/api/Quiz')

//Start express
const app = express();
app.use(bodyParser.json());

//Config DB
const db = require('./config/keys').mongoURI;

//Connect DB
mongoose
    .connect(db)
    .then( () => { console.log("MongoDB Connected") })
    .catch(err => console.log(err));

//Port depending on environment
const port = process.env.PORT || 5000;

//Server listening to port
app.listen(port, () => `Server running on port ${port}`);

//Enable CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
  
//Use Routes
app.use("/api/questions", questions);
app.use("/api/quiz", quiz);






