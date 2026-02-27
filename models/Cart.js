const mongoose = require('mongoose');
const User = require('./User');
const Lecture = require('./Lecture');
const Schema = mongoose.Schema;
const cartSchema = Schema({
    userId: {
        type: mongoose.ObjectId,
        ref: User,
        required: true
    },
    items: [{
        lectureId: {
            type: mongoose.ObjectId,
            ref: Lecture,
            required: true
        },
        txtbk: {
            type: String,
            required: true
        },
        fileTxtbk: {
            type: String,
            required: true
        },
        qty: {
            type: Number,
            default: 1,
            required: true
        }
    }]
}, {timestamps: true});

cartSchema.methods.toJSON = function () {
    const obj = this._doc;
    delete obj.__v;
    delete obj.updateAt;
    delete obj.createAt;

    return obj;
};

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;