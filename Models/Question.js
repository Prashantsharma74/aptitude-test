const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const questionSchema = new mongoose.Schema({
    questionText: {
        type: String,
        required: true,
    },
    options: [
        {
            text: String,
            isCorrect: Boolean,
        },
    ],
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium',
    },

    Type:{
              type:String,
              required:true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});


questionSchema.plugin(AutoIncrement, {id:'question_seq',inc_field: 'id'});

module.exports = mongoose.model('Question', questionSchema);
