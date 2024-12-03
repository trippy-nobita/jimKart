const express = require('express');
const connectDB = require('./db/config/db');
const dotenv = require('dotenv');

dotenv.config();

connectDB().then(r => {
  const app = express();

  //Init Middleware
  app.use(express.json({extended: false})); // Parse JSON requests

  app.use('/api', require('./routes/auth')); // Authentication routes
  app.use('/api', require('./routes/protected')); // Protected routes

  // Define a default route to test server response
  app.get('/', (req, res) => {
    res.send('API is running...');
  });

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

});


