const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, maxlength: 256, minlength: 3},
    email: { type: String, required: true},
    password: {type: String, required: true}
})


userSchema.methods.generateAuthToken = function() {
    return jwt.sign({_id: this._id}, config.get('jwtPrivateKey'));
}

const User = mongoose.model('Users', userSchema);



module.exports.User = User;