const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const quizSchema = new Schema({
    quizName: String,
    questions: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Question' } ]

});

module.exports = Quiz = mongoose.model('Quiz', quizSchema);