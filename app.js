const express = require('express');
const morgan = require('morgan');

const app = express();

if (process.env.NODE_ENV === 'develpoment') {
  app.use(morgan('dev'));
}

app.use(express.json());

const tourRouter = require(`./routes/tourRoutes`);
const userRouter = require(`./routes/userRoutes`);

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
