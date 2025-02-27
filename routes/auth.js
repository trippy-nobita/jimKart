const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {check, validationResult} = require('express-validator');
const User = require('../db/models/User');

const router = express.Router();

const generateUserId = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

if (!process.env.JWT_SECRET) {
  throw new Error('Missing JWT_SECRET in environment variables');
}

// Token expiration duration (configurable)
const TOKEN_EXPIRY = process.env.JWT_EXPIRY || '1h';

/**
 * @route    POST /api/signup
 * @desc     User signup
 * @access   Public
 */
router.post(
  '/signup',
  [
    check('name', 'Please enter your name').not().isEmpty(),
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Password must be 6 or more characters').isLength({min: 6})
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }
    const {name, email, password} = req.body;

    try {
      let user = await User.findOne({email});
      if (user) {
        return res.status(400).json({msg: 'User already exists'});
      }

      let userId = generateUserId();

      while (await User.findOne({userId})) {
        userId = generateUserId();
      }

      user = new User ({name, email, password, userId});

      //Hash password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {user : {id: user._id}};
      jwt.sign (
        payload,
        process.env.JWT_SECRET,
        {expiresIn: 3600},
        (err, token) => {
          if (err) throw err;
          res.json({token,
          userId: user.userId});
        });
    }
    catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
)


router.post(
  '/login',
  [
    check('userId', 'User ID is required').exists(),
    check('password', 'Password is required').exists()
  ],
  async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }

    const {userId, password} = req.body;

    try {
      let user = await User.findOne({userId});
      if (!user) {
        return res.status(400).json({msg: 'Invalid credentials'});
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({msg: 'Invalid credentials'});
      }

      const payload = {user: {id: user.id}};
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        {expiresIn: 3600},
        (err, token) => {
          if (err) throw err;
          res.json({token});
        });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
