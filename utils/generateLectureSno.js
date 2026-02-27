const LectureSno = require('../models/LectureSno');

const generateLectureSno = async () => {
  const year = new Date().getFullYear();

  const seqDoc = await LectureSno.findOneAndUpdate(
    { year },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  const seqNumber = String(seqDoc.seq).padStart(5, '0');

  return `LCT-${year}-${seqNumber}`;
};

module.exports = generateLectureSno;
