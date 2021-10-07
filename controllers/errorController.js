const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const { message } = err;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // if the error is operational error, send the message to the client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  // if the error is programming error or other error, don't leak error details
  else {
    // 1) log error
    // console.log('ERROR 💥', err);

    // 2) send generic message
    res.status(err.statusCode).json({
      status: err.status,
      message: 'Something wrong happened. Please refresh.',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.stauts = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    if (err.name === 'CastError') {
      err = handleCastErrorDB(err);
    } else if (err.code === 11000) {
      err = handleDuplicateFieldsDB(err);
    }
    sendErrorProd(err, res);
  }
};
