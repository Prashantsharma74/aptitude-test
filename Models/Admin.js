const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Hash password before saving
adminSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Method to compare password
adminSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
};

adminSchema.plugin(AutoIncrement, {id:'admin_seq',inc_field: 'id'});

module.exports = mongoose.model('Admin', adminSchema);

// make userschema for condidate for interview key field is email,phone number address,experiance  