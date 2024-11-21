const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (email) =>
                /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email),
            message: 'Invalid email format.',
        },
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (phone) =>
                /^\+?[1-9]\d{1,14}$/.test(phone), // E.164 format for phone numbers
            message: 'Invalid phone number format.',
        },
    },
    address: {
        type: String,
        required: true,
    },
    experience: {
        type: Number,
        required: true,
        min: [0, 'Experience cannot be negative.'],
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
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Method to compare password
userSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
};

// Export the model
module.exports = mongoose.model('User', userSchema);
