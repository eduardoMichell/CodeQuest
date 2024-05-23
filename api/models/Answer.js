const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const answerSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    gameId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Game'
    },
    score: {
        type: Number,
        required: true,
        default: 0
    },
    questions: {
        type: Schema.Types.Mixed,
        required: true
    }
}, { collection: 'Answers' });

module.exports = mongoose.model('Answers', answerSchema);
