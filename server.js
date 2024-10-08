const express = require('express');
const connectDB = require('./db/config/db');
const dotenv = require('dotenv');

dotenv.config();

connectDB().then(r => {
  const app = express();

//Init Middleware
  app.use(express.json({extended: false}));

  app.use('/api.auth', require('./routes/auth'));
  app.use('/api.protected', require('./routes/protected'));

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

});


