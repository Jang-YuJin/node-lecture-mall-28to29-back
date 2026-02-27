const mongoose = require('mongoose');
const User = require('./User');
const Lecture = require('./Lecture');
const Schema = mongoose.Schema;
const userLectureSchema = Schema({
    lectureId: {
        type: mongoose.ObjectId,
        ref: Lecture,
        required: true
    },
    userId: {
        type: mongoose.ObjectId,
        ref: User,
        required: true
    }
}, {timestamps: true});

userLectureSchema.methods.toJSON = function () {
    const obj = this._doc;
    delete obj.__v;
    delete obj.updateAt;
    delete obj.createAt;

    return obj;
};

const UserLecture = mongoose.model('userLecture', userLectureSchema);
module.exports = UserLecture;