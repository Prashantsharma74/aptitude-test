const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    email: { 
        type: String, 
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    }, 
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
        match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number']
    },
    address: {
       type:String,
       required:true
    },
    experience: {
        type: Number,
        required: true,
        min: [0, 'Experience cannot be negative'],
        max: [50, 'Experience seems unusually high']
    },
    assignedQuestions:{
       type:Array
    },
    Total : {
        type:Number,
        default:0
    },
    isSubmit : {
        type:Boolean,
        default:false
    },
    Domain: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
userSchema.plugin(AutoIncrement, {id:'user_seq',inc_field: 'id'});

const Candidate = mongoose.model('Candidate', userSchema);

module.exports = Candidate;
