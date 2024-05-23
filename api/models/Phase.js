const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const phaseSchema = new Schema({
    gameId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Game'  
    },
    questions: [{
        type: Schema.Types.ObjectId,
        ref: 'Question'  
    }]
}, { collection: 'Phase' });

module.exports = mongoose.model('Phase', phaseSchema);
