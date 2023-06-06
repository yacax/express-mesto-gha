const express = require('express');
const mongoose = require('mongoose');
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

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).send({ message: err.message || 'Internal Server Error' });
  next();
});

app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
});
