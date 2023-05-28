const express = require('express');
const mongoose = require('mongoose');
const { logger } = require('./utils/logger');

const app = express();
const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '646f84b4014fb6bd5f6957f7',
  };

  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('*', (req, res) => {
  res.status(404).json({ message: 'Resource not found' });
});

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).send({ message: err.message || 'Internal Server Error' });
  next();
});

app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
});
