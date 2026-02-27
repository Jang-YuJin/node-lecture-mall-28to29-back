const authController = {};
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

authController.loginWithEmail = async(req, res) => {
    try {
        const {email, pwd} = req.body;

        if(!email){
            throw new Error('이메일을 입력해주세요.');
        }
        if(!pwd){
            throw new Error('비밀번호를 입력해주세요.')
        }

        const user = await User.findOne({email}, '-createdAt -updatedAt -__v');

        if(user){
            const isMatch = await bcrypt.compare(pwd, user.pwd);
            if(isMatch){
                const token = user.generateToken();
                return res.status(200).json({status: 'success', user, token});
            }
        }

        throw new Error('아이디 또는 비밀번호가 일치하지 않습니다.');
    } catch (error) {
        res.status(400).json({status: 'fail', message: error.message});
    }
};

authController.authenticate = (req, res, next) => {
    try {
        const tokenString = req.headers.authorization;
        if(!tokenString){
            throw new Error('토큰을 찾을 수 없습니다.');
        }

        const token = tokenString.replace('Bearer ', '');
        jwt.verify(token, JWT_SECRET_KEY, (error, payload) => {
            if(error){
                throw new Error('로그인이 필요합니다.');
            }
            req.userId = payload._id;
            next();
        });
    } catch (error) {
        res.status(400).json({status: 'fail', message: error.message});
    }
};

authController.checkAdminPermission = async(req, res, next) => {
    try {
        const {userId} = req;
        const user = await User.findById(userId);

        if(user.lvl !== 'admin') {
            throw new Error('권한이 없습니다.');
        }

        next();
    } catch (error) {
        res.status(400).json({status: 'fail', message: error.message})
    }
};

authController.checkSellerPermission = async(req, res, next) => {
    try {
        const {userId} = req;
        const user = await User.findById(userId);

        if(user.lvl !== 'seller') {
            throw new Error('권한이 없습니다.');
        }

        next();
    } catch (error) {
        res.status(400).json({status: 'fail', message: error.message})
    }
};

module.exports = authController;