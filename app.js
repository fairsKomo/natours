const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const glopalErrorHandler = require('./controllers/errorController');

const app = express();

if (process.env.NODE_ENV === 'develpoment') {
  app.use(morgan('dev'));
}

app.use(express.json());

const tourRouter = require(`./routes/tourRoutes`);
const userRouter = require(`./routes/userRoutes`);

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// Unhandeled routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find: ${req.originalUrl}`, 404));
});

app.use(glopalErrorHandler);

module.exports = app;
