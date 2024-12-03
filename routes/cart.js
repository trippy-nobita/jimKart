const express = require('express');
const {check, validationResult} = require('express-validator');

const Cart = require('../db/models/Cart');
const Product = require('../db/models/Product');

const auth = require('../middleware/auth');

const router = express.Router();


router.post(
  '/add',
  [auth, [check('productId', 'Product ID is required')
    .not()
    .isEmpty()
    , check('quantity', 'Quantity must be a number').isInt()]],
  async (req, res) => {
      const errors = validationResult(req);
      if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
      }

      const {productId, quantity} = req.body;

      try{
        const product = await Product.findById(productId);
        if (!product) {
          return res.status(404).json({msg: 'Product not found'});
        }

        let cart = await Cart.findOne({userId: req.user.id});
        // If not cart create a new one
        if (!cart) {
          cart = new Cart({
            userId: req.user.id,
            items: [{productId, quantity, price: product.price}],
            totalPrice: product.price * quantity,
          });
        }
        else{
          const itemIndex = cart.items.findIndex(item => item.productId === productId);

          if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
            cart.items[itemIndex].price += product.price * quantity;
          }
          else{
            cart.items.push({productId, quantity, price: product.price * quantity});
          }

          cart.totalPrice += product.price * quantity;
        }
       await cart.save();
        res.json(cart);
    }
    catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }
  });

// @route   GET /api/cart
// @desc    Get user cart
// @access  Private

router.get('/', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId', 'name price');
    if (!cart) {
      return res.status(404).json({ msg: 'Cart is empty' });
    }
    res.json(cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/cart/update
// @desc    Update item quantity in cart
// @access  Private

router.put(
  '/update',
  [auth, [check('productId', 'Product ID is required').not().isEmpty(), check('quantity', 'Quantity must be a number').isInt()]],
  async (req, res) => {
    const {productID, quantity} = req.body;

    try{
      let cart = await Cart.findOne({userId: req.user.id});
      if(!cart){
        return res.status(404).json({msg: 'Cart not found'});
      }

      const itemIndex = cart.items.findIndex(item => item.productId === productId);
      if (itemIndex === -1) {
        return res.status(404)
      }
    }
    catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
)
