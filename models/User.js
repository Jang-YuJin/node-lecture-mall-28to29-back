const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const userSchema = Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    pwd: {
        type: String,
        required: true
    },
    lvl: {
        type: String,
        default: 'customer' //custommer/seller/admin
    },
    approval: {
        type: Boolean
    }
}, {timestamps: true});

userSchema.methods.toJSON = function () {
    const obj = this._doc;
    delete obj.pwd;
    delete obj.__v;
    delete obj.updateAt;
    delete obj.createAt;

    return obj;
};

userSchema.methods.generateToken = function() {
 const token = jwt.sign({_id: this._id}, JWT_SECRET_KEY, {
    expiresIn: '1h'
 });
 return token;
};

const User = mongoose.model('User', userSchema);
module.exports = User;