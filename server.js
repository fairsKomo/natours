const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config();

process.on('uncaughtException', err => {
  console.log(err.name, err.message);
  console.log('Uncaught Exception. system is shutting down...');
  process.exit(1);
})

const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((con) => {
    console.log('Database Connected Succefully');
  });

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`App running on ${PORT}`);
});

process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  console.log('Unhandeld Rejection. system is shutting down...');
  server.close(() => {
    process.exit(1);
  })
})