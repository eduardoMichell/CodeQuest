const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gameSchema = new Schema({
    theme: {
        type: String,
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User' 
    },
    difficulty: {
        type: String,
        required: true,
        enum: [ 'Iniciante', 'Intermediário', 'Avançado']
    },
    phases: [{
        type: Schema.Types.ObjectId,
        ref: 'Phase'
    }]
}, { collection: 'Game' });

module.exports = mongoose.model('Game', gameSchema);
