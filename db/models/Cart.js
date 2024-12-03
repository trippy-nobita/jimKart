const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    items: [
        {
            productName: {
                type: String,
                required: true,
            },
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },

            quantity: {
                type: Number,
                require: true,
                default: 1,
            },

            price: {
                type: Number,
                required: true,
            }
        }
    ],  totalPrice: {
        type: Number,
        required: true,
        default: 0,
    },
      date: {
        type: Date,
        default: Date.now,
      }
});


module.exports = mongoose.model('Cart', cartSchema);
