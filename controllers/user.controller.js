const User = require("../models/User");
const bcrypt = require('bcryptjs');

const userController = {};

userController.createUser = async(req, res) => {
  try {
    let {email, pwd, name, lvl} = req.body;

    if(!email){
        throw new Error('이메일을 입력해주세요.');
    }
    if(!pwd){
        throw new Error('비밀번호를 입력해주세요.');
    }
    if(!name){
        throw new Error('이름을 입력해주세요.');
    }
    if(!lvl){
        throw new Error('가입유형을 선택해주세요.');
    }

    const user = await User.findOne({email});
    if(user){
        throw new Error('이미 존재하는 사용자입니다.');
    }

    const salt = await bcrypt.genSaltSync(10);
    pwd = await bcrypt.hash(pwd, salt);
    const newUser = new User({email, pwd, name, lvl: lvl ? lvl : 'customer'});
    await newUser.save();

    return res.status(200).json({status: 'success'});
  } catch (error) {
    res.status(400).json({status: 'fail', message: error.message});
  }  
};

userController.getUser = async(req, res) => {
  try {
    const {userId} = req;
    const user = await User.findById(userId);
    if(user){
      return res.status(200).json({status: 'success', user})
    }
    throw new Error('만료된 토큰입니다.');
  } catch (error) {
    return res.status(400).json({status: 'fail', message: error.message})
  }
};

module.exports = userController;