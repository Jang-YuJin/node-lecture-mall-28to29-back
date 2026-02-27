const mongoose = require('mongoose');
const User = require('./User');
const Schema = mongoose.Schema;
const lectureSchema = Schema({
    sno: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.ObjectId,
        ref: User,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    ctgry: {
        type: Array,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    txtbkStck: {
        type: Object,
        required: true
    },
    txtbkPrice: {
        type: Object,
        required: true
    },
    fileTxtbk: {
        type: Array,
        default: 'active'
    },
    status: {
        type: String,
        default: 'active'
    },
    items: {
        type: [{
            title: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        }]
    },
    dscnt: {
        type: Boolean,
        required: true
    },
    dscntRt: {
        type: Number
    },
    delYn: {
        type: Boolean,
        default: false
    }
}, {timestamps: true});

lectureSchema.methods.toJSON = function () {
    const obj = this._doc;
    delete obj.__v;
    delete obj.updateAt;
    delete obj.createAt;

    return obj;
};

const Lecture = mongoose.model('Lecture', lectureSchema);
module.exports = Lecture;