const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  //get the token from the header
  const token = req.header('Authorization');

  // check if no token
  if (!token) {
    return res.status(401).json({msg: 'No token, authorization denied'});
  }

  try {
    //verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //Attach the user to the request object
    req.user = decoded.user;
    next();
  } catch(err) {
    res.status(401).json({msg: 'Token is not valid'});
  }
}

module.exports = auth;
