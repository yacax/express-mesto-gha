const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { logger } = require('./utils/logger');
const { login, createUser } = require('./controllers/user');
const { validateAuthentication, validateUserBody } = require('./utils/validators');
const auth = require('./middlewares/auth');
const { NoRightsToTheOperation, NotFoundError } = require('./errors/NoRightsToTheOperation');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
app.use(helmet());
const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  handler: function handlerError() {
    throw new NoRightsToTheOperation();
  },
});
app.use(limiter);

app.use(express.json());
app.post('/signin', validateAuthentication, login);
app.post('/signup', validateUserBody, createUser);

app.use(auth);
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('*', (req, res, next) => {
  next(new NotFoundError('Resource not found'));
});

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
});
