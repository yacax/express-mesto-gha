const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const { logger } = require('./utils/logger');
const { login, createUser } = require('./controllers/user');
const { validateAuthentication, validateUserBody } = require('./utils/validators');
const auth = require('./middlewares/auth');

const app = express();
const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(express.json());
app.post('/signin', validateAuthentication, login);
app.post('/signup', validateUserBody, createUser);

app.use(auth);
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('*', (req, res) => {
  res.status(404).json({ message: 'Resource not found' });
});

app.use(errors());

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.joi ? err.joi.details[0].message : err.message || 'Internal Server Error';

  res.status(statusCode).send({ message });
  next();
});

app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
});
