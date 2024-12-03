const mongoose = require('mongoose');
const {Schema} = mongoose;

const productSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
});

module.exports = mongoose.model('Product', productSchema);
