const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const authentication = require('../services/authentication');

const userSchema = new Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
}, { collection: 'users' });

userSchema.pre("save", async function (next) {
    const newPass = await authentication.hashPassword(this.password);
    if (newPass.error) {
        return new Promise((resolve, reject) => {
            reject(new Error(newPass.message));
        });
    }
    this.password = newPass.result;
    next();
});

module.exports = mongoose.model('users', userSchema);
