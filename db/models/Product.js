const mongoose = require('mongoose');
const {Schema} = mongoose;

const productSchema = new Schema({
  gymId: {
    gymId: mongoose.Schema.Types.ObjectId,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
   days: {
    type: Number,
    required: true
  },
});

module.exports = mongoose.model('Product', productSchema);
