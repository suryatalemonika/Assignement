const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    Email: { type: String, require: true },
    PhoneNumber: { type: Number, require: true },
    Password: { type: String, require: true },
    ConfirmPassword: { type: String, require: true }
})

const userModel = mongoose.model('usermodel', userSchema);

module.exports = {
    userModel
}