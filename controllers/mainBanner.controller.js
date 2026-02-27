const MainBanner = require('../models/MainBanner');
const PAGE_SIZE = 12;
const mainBannerController = {};

mainBannerController.createMainBanner = async(req, res) => {
    try {
        const {img, postYn} = req.body;
        const mainBanner = new MainBanner({img, postYn});

        await mainBanner.save();
        res.status(200).json({status: 'success', mainBanner});
    } catch (error) {
        return res.status(400).json({status: 'fail', message: error.message})
    }
};

mainBannerController.getMainBanners = async(req, res) => {
    try {
        const {page, postYn} = req.query;
        const condition = {delYn: false};
        let query = MainBanner.find(condition);
        let response = {status: 'success'};
        if(postYn){
            query.postYn = postYn;
        }
        if(page){
            query.skip((page - 1) * PAGE_SIZE).limit(PAGE_SIZE);
            const totalItemNum = await MainBanner.countDocuments(condition);
            const totalPageNum = Math.ceil(totalItemNum/PAGE_SIZE);
            response.totalPageNum = totalPageNum;
        }
        const mainBanners = await query.exec();
        response.data = mainBanners;

        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({status: 'fail', message: error.message});
    }
};

mainBannerController.updateMainBanner = async(req, res) => {
    try {
        const mainBannerId = req.params.id;
        const {img, postYn} = req.body;
        const mainBanner = await MainBanner.findByIdAndUpdate({_id: mainBannerId}, {img, postYn}, {new: true});

        res.status(200).json({status: 'success', data: mainBanner});
    } catch (error) {
        return res.status(400).json({status: 'fail', message: error.message})
    }
};

mainBannerController.deleteMainBanner = async(req, res) => {
    try {
        const mainBannerId = req.params.id;
        const mainBanner = await MainBanner.findByIdAndUpdate({_id: mainBannerId}, {delYn: true}, {new: true});

        res.status(200).json({status: 'success', data: mainBanner});
    } catch (error) {
        return res.status(400).json({status: 'fail', message: error.message})
    }
};

module.exports = mainBannerController;