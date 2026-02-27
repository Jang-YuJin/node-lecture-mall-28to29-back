const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const lectureSnoSchema = new Schema({
  year: {
    type: Number,
    required: true,
    unique: true
  },
  seq: {
    type: Number,
    default: 0
  }
});

const LectureSno = mongoose.model('LectureSno', lectureSnoSchema);
module.exports = LectureSno;