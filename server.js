const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config();

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
app.listen(PORT, () => {
  console.log(`App running on ${PORT}`);
});
