const Lecture = require('../models/Lecture');
const generateLectureSno = require('../utils/generateLectureSno');
const PAGE_SIZE = 5;
const lectureController = {};

lectureController.getLectureSno = async(req, res) => {
    try {
        const sno = await generateLectureSno();

        return res.status(200).json({status: 'success', sno});
    } catch (error) {
        return res.status(400).json({status: 'fail', message: error.message})
    }
};

lectureController.createLecture = async(req, res) => {
    try {
        const {sno, name, img, ctgry, desc, price, txtbkStck, txtbkPrice, fileTxtbk, status, items, dscnt, dscntRt} = req.body;
        const {userId} = req;
        const lecture = new Lecture({sno, name, userId, img, ctgry, desc, price, txtbkStck, txtbkPrice, fileTxtbk, status, items, dscnt, dscntRt});

        await lecture.save();
        res.status(200).json({status: 'success', lecture});
    } catch (error) {
        return res.status(400).json({status: 'fail', message: error.message})
    }
};

lectureController.getLectures = async(req, res) => {
    try {
        const {page, userId, name} = req.query;
        const condition = {delYn: false};
        if(userId){
            condition.userId = userId;
        }
        if(name){
            condition.name = {$regex: name, $options: 'i'};
        }
        let query = Lecture.find(condition);
        let response = {status: 'success'};
        if(page){
            query.skip((page - 1) * PAGE_SIZE).limit(PAGE_SIZE);
            const totalItemNum = await Lecture.countDocuments(condition);
            const totalPageNum = Math.ceil(totalItemNum/PAGE_SIZE);
            response.totalPageNum = totalPageNum;
        }
        const lectures = await query.exec();
        response.data = lectures;

        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({status: 'fail', message: error.message});
    }
};

lectureController.updateLecture = async(req, res) => {
    try {
        const lectureId = req.params.id;
        const {name, img, ctgry, desc, price, txtbkStck, txtbkPrice, fileTxtbk, status, items, dscnt, dscntRt} = req.body;
        const {userId} = req;
        const lecture = await Lecture.findByIdAndUpdate({_id: lectureId}, {name, img, ctgry, desc, price, txtbkStck, txtbkPrice, fileTxtbk, status, items, dscnt, dscntRt, userId}, {new: true});

        res.status(200).json({status: 'success', data: lecture});
    } catch (error) {
        return res.status(400).json({status: 'fail', message: error.message})
    }
};

lectureController.deleteLecture = async(req, res) => {
    try {
        const lectureId = req.params.id;
        const {userId} = req;
        const lecture = await Lecture.findByIdAndUpdate({_id: lectureId}, {delYn: true, userId}, {new: true});

        res.status(200).json({status: 'success', data: lecture});
    } catch (error) {
        return res.status(400).json({status: 'fail', message: error.message})
    }
};

lectureController.getMainLectures = async(req, res) => {
    try {
        const webLecture = await Lecture.find({delYn: false, ctgry: '웹개발'}).sort({ updatedAt: -1 }).limit(4);
        const aiLecture = await Lecture.find({delYn: false, ctgry: 'ai'}).sort({ updatedAt: -1 }).limit(4);
        const dbLecture = await Lecture.find({delYn: false, ctgry: 'db'}).sort({ updatedAt: -1 }).limit(4);
        const devLecture = await Lecture.find({delYn: false, ctgry: '데브옵스'}).sort({ updatedAt: -1 }).limit(4);
        const javaLecture = await Lecture.find({delYn: false, ctgry: 'java'}).sort({ updatedAt: -1 }).limit(4);
        const springLecture = await Lecture.find({delYn: false, ctgry: 'spring'}).sort({ updatedAt: -1 }).limit(4);

        const response = {
            status: 'success',
            data: {
                webLecture,
                aiLecture,
                dbLecture,
                devLecture,
                javaLecture,
                springLecture
            }
        };

        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({status: 'fail', message: error.message});
    }
};

lectureController.getLecture = async(req, res) => {
    try {
        const lectureId = req.params.id;
        const lecture = await Lecture.findById(lectureId);
        if(lecture){
            return res.status(200).json({status: 'success', data: lecture});
        }

        throw new Error('해당 강의가 없습니다.');
    } catch (error) {
        res.status(400).json({status: 'fail', message: error.message});
    }
};

lectureController.checkItemListStork = async(itemList) => {
    const insufficientStockItems = [];

    await Promise.all(itemList.map(async(item) => {
        const stockCheck = await lectureController.checkStock(item);

        if(!stockCheck.isVerify){
            insufficientStockItems.push({item, message: stockCheck.message});
        }

        return stockCheck;
    }));
    return insufficientStockItems;
};

lectureController.checkStock = async(item) => {
    const lecture = await Lecture.findById(item.lectureId);

    if(lecture.txtbkStck[item.txtbkType] < item.qty){
        return {isVerify: false, message: `"${lecture.name}" 강의의 "${item.txtbkType == 'bind' ? '제본(스프링) 교재' : '책 교재'}" 재고가 부족합니다.`};
    }

    const newStock = {...lecture.txtbkStck};
    newStock[item.txtbkType] -= item.qty;
    lecture.txtbkStck = newStock;

    await lecture.save();

    return {isVerify: true};
};

module.exports = lectureController;