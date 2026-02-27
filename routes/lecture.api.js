const express = require('express');
const lectureController = require('../controllers/lecture.controller');
const authController = require('../controllers/auth.controller');
const router = express.Router();

//강의 시퀀스
router.get('/sno',lectureController.getLectureSno);

router.post('/', authController.authenticate, authController.checkSellerPermission, lectureController.createLecture);
router.get('/', lectureController.getLectures);
router.put('/:id', authController.authenticate, authController.checkSellerPermission, lectureController.updateLecture);
router.delete('/:id', authController.authenticate, authController.checkSellerPermission, lectureController.deleteLecture);

router.get('/main', lectureController.getMainLectures);
router.get('/:id', lectureController.getLecture);

module.exports = router;