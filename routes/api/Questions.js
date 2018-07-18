const express = require('express');
const router = express.Router();
const Joi = require('joi');
const utilities = require('../../common/ultilities'); 

//Item Models
const Question = require("../../models/Question");

//@route GET api/questions/:id
//@desc Returns 10 random questions for the quiz 
//@access Public
router.get('/:id', (req, res) => {
    Question.find({id: req.params.id})
    .then(questions => {
        const maxLength = questions.length - 1;
        let returnVal = {val: 'Not enough questions submitted. Please submit more questions.'}
        res.status(406);
        if(maxLength >= 10){
            res.status(200);
            const randomNumbers = utilities.getRandomIntArray(0, maxLength)
            returnVal = randomNumbers.map(num => {
                return questions[num];
            });
        }
        res.json(returnVal);
    })
    .catch(err =>{
        res.status(400).json({error: err});
    });
});

//@route POST /api/questions/:id
//@desc Post a new question to a given quiz
//@access Public
router.post('/:id', (req, res) => {
    const schema = {
        name: Joi.string().required(),
        type: Joi.string().required(),
        explanation: Joi.string(),
        answers: Joi.array().required()
    }
    const input = req.body;
    const validation = Joi.validate(input, schema);
    
    if(validation.error){
        res.status(400).json(validation.error.details[0].message)
        return;
    }

    const newQuestion = new Question({
        name: req.body.name,
        id: req.params.id,
        type: req.body.type,
        explanation: req.body.explanation,
        comments: [],
        rating: 0,
        answers: req.body.answers
    });

    newQuestion.save()
        .then(question => {
            res.json(question)
        })
        .catch(err =>{
            res.status(400).json({error: err});
        });
});

module.exports = router;