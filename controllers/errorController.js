const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleValidatorErrorDB = (err) => {
  const vals = Object.values(err.errors).map((el) => el.message);
  const message = vals.join('. ');
  return new AppError(message, 400);
};

const handleMongoErrorDB = (err) => {
  const val = err.keyValue.name;
  const message = `Duplicate fields on the value: ${val}. use another one`;
  return new AppError(message, 400);
};

const handleJWTError = () => {
  return new AppError('Invalid Token try again!', 401);
};

const handleJWTexpiredError = () => {
  return new AppError('Token has expired try again!', 401);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOpreational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: 'error',
      message: 'Somthing very weird happend be patient',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'Error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.name = err.name;
    if (error.name === 'CastError') {
      error = handleCastErrorDB(error);
    }
    if (error.code === 11000) {
      error = handleMongoErrorDB(error);
    }
    if (err.name === 'ValidationError') {
      error = handleValidatorErrorDB(error);
    }
    if (err.name === 'JsonWebTokenError') {
      error = handleJWTError();
    }
    if (err.name === 'TokenExpiredError') {
      error = handleJWTexpiredError();
    }
    sendErrorProd(error, res);
  }
};
