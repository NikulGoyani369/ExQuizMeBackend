const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionsSchema = new Schema({
    name: String,
    id: String,
    type: String,
    explanation: String,
    comments: [String],
    rating: Number,
    answers: [{
        text: String,
        correctness: Boolean
    }]
});

module.exports = Question = mongoose.model('Question', questionsSchema);