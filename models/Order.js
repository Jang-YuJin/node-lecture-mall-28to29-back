const mongoose = require('mongoose');
const User = require('./User');
const Lecture = require('./Lecture');
const Cart = require('./Cart');
const Schema = mongoose.Schema;
const orderSchema = Schema({
    shipAddrss: {
        type: Object,
        required: true
    },
    contact: {
        type: Object,
        required: true
    },
    ttlPrc: {
        type: Number,
        required: true,
        default: 0
    },
    userId: {
        type: mongoose.ObjectId,
        ref: User,
        required: true
    },
    status: {
        type: String,
        default: 'preparing'
    },
    orderNum: { 
        type: String 
    },
    items: [{
        lectureId: {
            type: mongoose.ObjectId,
            ref: Lecture,
            required: true
        },
        txtbkType: {
            type: String,
            required: true
        },
        fileTxtbkType: {
            type: String,
            required: true
        },
        qty: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        dscntYn: {
            type: Boolean,
            required: true
        },
        dscntRt: {
            type: Number
        },
        txtbkPrice: {
            type: Number,
            required: true
        }
    }]
}, {timestamps: true});

orderSchema.methods.toJSON = function () {
    const obj = this._doc;
    delete obj.__v;
    delete obj.updateAt;
    delete obj.createAt;

    return obj;
};

orderSchema.post('save', async function(){
    const cart = await Cart.findOne({userId: this.userId});
    cart.items = [];
    await cart.save();
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;