const express = require('express');
const mainBannerController = require('../controllers/mainBanner.controller');
const router = express.Router();

router.get('/', mainBannerController.getMainBanners);
router.post('/', mainBannerController.createMainBanner);
router.put('/:id', mainBannerController.updateMainBanner);
router.delete('/:id', mainBannerController.deleteMainBanner);

module.exports = router;