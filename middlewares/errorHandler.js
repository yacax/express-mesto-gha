module.exports = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.joi ? err.joi.details[0].message : err.message || 'Internal Server Error';
  res.status(statusCode).send({ message });
  next();
};
