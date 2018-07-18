const express = require('express');
const router = express.Router();
const Joi = require('joi');

//Item Models
const Question = require("../../models/Question");
const Quiz = require("../../models/Quiz");

//@route GET /api/quiz/:id
//@desc Get a quiz by name
//@access Public
router.get('/:id', (req, res) => {
    Quiz.findById(req.params.id)
        .then(quiz => {
            res.json(quiz)
        })
        .catch(err =>{
            res.status(400).json({error: err});
        });
});

//@route POST /api/quiz/
//@desc Post a new quiz
//@access Public
router.post('/', (req, res) => {
    const schema = {
        quizName: Joi.string().required()
    }
    const input = req.body;
    const validation = Joi.validate(input, schema);
    if(validation.error){
        res.status(400).send(validation.error.details[0].message)
        return;
    }
    let newQuiz = new Quiz({
        quizName: req.body.quizName
    });
    newQuiz.save()
        .then(quiz => {
        res.json(quiz)
        })
        .catch(err =>{
            res.status(400).json({error: err});
        });
});

//@route POST /api/quiz/:quizID/questions/:questionID/feedback/:type
//@desc Post some feedback regarding a question. There are two types of questions: Comment & Rating. If the rating is below 5, the question is deleted.
//@access Public
router.post('/:quizID/questions/:questionID/feedback/:type', (req, res) => {
    const type = req.params.type;
    const input = req.body.input;
    const question = req.params.questionID;

    if(type != "comment" && type != "rating"){
        res.status(400).json({val: "Unsupported feedback type."});
        return;
    } 

    if(question == undefined){
        res.status(400).json({val: "Question not found."})
        return;
    }

    if(typeof input != "number" && typeof input != "string"){
        res.status(400).send({val: "Wrong input."})
        return;
    }
    if(type === "comment"){
        Question.findOneAndUpdate(
            { 
                _id: question // search query
            },
            {
                $push: {
                    comments: input
                }
            },
            {
                new: true,                       // return updated doc
                runValidators: true              // validate before update
            }
        )
        .exec()
        .then(question => {
            res.json(question)
        })
        .catch(err =>{
            res.status(400).json({error: err});
        });
    }
    else {
        Question.findOneAndUpdate(
            {
                _id: question // search query
            },
            {
                $inc: {
                    rating: input
                }
            },                               //To update the rating by 1
            {
                new: true,                       // return updated doc
                runValidators: true              // validate before update
            }
        )
        .exec()
        .then(question => {
            if(question.rating <= -5){
                Question.findById(question._id)
                .then( question => question.remove().then(() => {
                    res.json({ success: "Question deleted" })
                    return;
                }))
                .catch(err => res.status(404).json({ success: false }));
            } else {
                res.json(question)
            }
        })
        .catch(err =>{
            res.status(400).json({error: err});
        });
    }
});

module.exports = router;