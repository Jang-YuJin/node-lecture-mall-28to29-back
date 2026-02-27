const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mainBannerSchema = Schema({
    img: {
        type: String,
        required: true
    },
    postYn: {
        type: Boolean,
        default: true
    },
    delYn: {
        type: Boolean,
        default: false
    }
}, {timestamps: true});

mainBannerSchema.methods.toJSON = function () {
    const obj = this._doc;
    delete obj.__v;
    delete obj.updateAt;
    delete obj.createAt;

    return obj;
};

const MainBanner = mongoose.model('MainBanner', mainBannerSchema);
module.exports = MainBanner;