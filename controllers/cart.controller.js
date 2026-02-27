const Cart = require('../models/Cart');
const Lecture = require('../models/Lecture');
const { populate } = require('../models/LectureSno');
const cartController = {};

cartController.addToCart = async(req, res) => {
    try {
        const {userId} = req;
        const {lectureId, txtbk, fileTxtbk, qty} = req.body;

        //유저가 카트를 가지고 있는지
        let cart = await Cart.findOne({userId});
        //유저가 카트가 없으면 만들어주기
        if(!cart){
            cart = new Cart({userId});
            await cart.save();
        }
        //이미 카트에 들어가 있는 아이템인지
        const existItem = cart.items.find((item) => item.lectureId.equals(lectureId));
        //이미 카트에 아이템이 있다면 에러
        if(existItem){
            throw new Error('이미 장바구니에 있는 강의입니다.');
        }
        //본인이 만든 강의라면 에러
        const lecture = await Lecture.findById(lectureId);
        if(lecture.userId == userId){
            throw new Error('본인 강의는 장바구니에 담을 수 없습니다.');
        }
        //아니라면 카트에 아이템 추가
        cart.items = [...cart.items, {lectureId, txtbk, fileTxtbk, qty}];
        await cart.save();

        res.status(200).json({status: 'success', data: cart, cartItemQty: cart.items.length});
    } catch (error) {
        res.status(400).json({status: 'fail', message: error.message});
    }
};

cartController.getCartList = async(req, res) => {
    try {
        const {userId} = req;
        const cart = await Cart.findOne({userId}).populate({
            path: 'items',
            populate: {
                path: 'lectureId',
                model: 'Lecture'
            }
        });

        res.status(200).json({status: 'success', data: cart.items});
    } catch (error) {
        res.status(400).json({status: 'fail', message: error.message});
    }
};

cartController.editCartItem = async(req, res) => {
    try {
        const {userId} = req;
        const {id} = req.params;
        const {value, key} = req.body;

        const cart = await Cart.findOne({userId}).populate({
            path: 'items',
            populate: {
                path: 'lectureId',
                model: 'Lecture'
            }
        });

        if(!cart){
            throw new Error('장바구니가 없습니다.');
        }
        const index = cart.items.findIndex((item) => item._id.equals(id));
        if(index < 0){
            throw new Error('강의를 찾을 수 없습니다.');
        }

        if(key === 'qty'){
            cart.items[index].qty = value;
        }else if(key === 'fileTxtbk'){
            cart.items[index].fileTxtbk = value;
        }else if(key === 'txtbk'){
            cart.items[index].txtbk = value;
        }else{
            throw new Error('올바른 장바구니 수정사항이 아닙니다. 관리자에게 문의해주세요.')
        }
        await cart.save();
        res.status(200).json({ status: 200, data: cart.items });
    } catch (error) {
        res.status(400).json({status: 'fail', message: error.message});
    }
};

cartController.getCartQty = async(req, res) => {
    try {
        const {userId} = req;
        const cart = await Cart.findOne({userId});
        if(!cart){
            throw new Error('장바구니가 없습니다.');
        }
        res.status(200).json({status: 'success', qty: cart.items.length});
    } catch (error) {
        res.status(400).json({status: 'fail', message: error.message});
    }
};

cartController.deleteCartItem = async(req, res) => {
    try {
        const {userId} = req;
        const {id} = req.params;

        const cart = await Cart.findOne({ userId });
        cart.items = cart.items.filter((item) => !item._id.equals(id));

        await cart.save();
        res.status(200).json({status: 'success', cartItemQty: cart.items.length});
    } catch (error) {
        res.status(400).json({status: 'fail', message: error.message});
    }
};

module.exports = cartController;