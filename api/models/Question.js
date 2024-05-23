const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
    phaseId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Phase'
    },
    question: {
        type: String,
        required: true
    },
    options: [{
        type: String,
        required: true
    }],
    answer: {
        type: Number,
        required: true
    },
    rate: {
        type: Number,
        required: false,
        default: 0
    },
    time: {
        type: Number,
        required: true
    },
}, { collection: 'Question' });

module.exports = mongoose.model('Question', questionSchema);
