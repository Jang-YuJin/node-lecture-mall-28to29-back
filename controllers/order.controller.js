const { default: mongoose } = require("mongoose");
const { populate } = require("../models/LectureSno");
const Order = require("../models/Order");
const { randomStringGenerator } = require("../utils/randomStringGenerator");
const lectureController = require("./lecture.controller");
const PAGE_SIZE = 3;
const orderController = {};

orderController.createOrder = async(req, res) => {
    try {
        const {userId} = req;
        const {shipAddrss, contact, ttlPrc, orderList} = req.body;

        const insufficientStockItems = await lectureController.checkItemListStork(orderList);

        if(insufficientStockItems.length > 0){
            const errorMessage = insufficientStockItems.reduce((total, item) => (total += item.message), '');
            throw new Error(errorMessage);
        }

        const newOrder = new Order({
            userId,
            ttlPrc,
            shipAddrss,
            contact,
            items: orderList,
            orderNum: randomStringGenerator()
        });

        await newOrder.save();

        res.status(200).json({status: 'success', orderNum: newOrder.orderNum});
    } catch (error) {
        res.status(400).json({status: 'fail', message: error.message});
    }
};

orderController.getOrder = async(req, res) => {
    try {
        const {userId} = req;
        const {page} = req.query;

        const orderList = await Order.find({userId}).populate({
            path: 'items',
            populate: {
                path: 'lectureId',
                model: 'Lecture'
            }
        }).populate({
            path: 'userId',
            model: 'User'
        }).skip((page - 1) * PAGE_SIZE).limit(PAGE_SIZE);
        const totalItemCnt = await Order.find({userId}).countDocuments();
        const totalPageNum = Math.ceil(totalItemCnt/PAGE_SIZE);

        res.status(200).json({status: 'success', orderList: orderList, totalPageNum: totalPageNum});
    } catch (error) {
        res.status(400).json({status: 'fail', message: error.message});
    }
};

orderController.getOrderList = async(req, res) => {
    try {
        const {userId} = req;
        const {page, ordernum} = req.query;
        const condition = {};

        if(ordernum){
            condition.orderNum = {$regex: ordernum, $options: 'i'};
        }

        let query = Order.find(condition);
        let response = {status: 'success'};
        if(page){
            query.skip((page - 1) * PAGE_SIZE).limit(PAGE_SIZE);
            const totalItemCnt = await Order.countDocuments(condition);
            const totalPageNum = Math.ceil(totalItemCnt/PAGE_SIZE);
            response.totalPageNum = totalPageNum;
        }
        const orderList = await query.populate({
            path: 'items',
            populate: {
                path: 'lectureId',
                model: 'Lecture',
                match: {userId: userId}
            }
        }).populate({
            path: 'userId',
            model: 'User'
        }).exec();
        response.orderList = orderList;
        

        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({status: 'fail', message: error.message});
    }
};

orderController.updateOrder = async (req, res) => {
  try {
    const {id} = req.params;
    const {status} = req.body;
    const order = await Order.findByIdAndUpdate(
      id,
      { status: status },
      { new: true }
    );
    if (!order){
      throw new Error("주문을 찾을 수 없습니다.");
    }

    res.status(200).json({ status: "success", data: order });
  } catch (error) {
    return res.status(400).json({ status: "fail", error: error.message });
  }
};

module.exports = orderController;