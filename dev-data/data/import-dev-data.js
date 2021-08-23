const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const Tour = require('../../models/tourModel');

dotenv.config({ path: '../../config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB connection successful');
  });

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);
// import tours-simple.json
const importTours = async () => {
  try {
    await Tour.create(tours);
    console.log('tours imported successfully');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

// delete all documents in collection tours
const deleteTours = async () => {
  try {
    await Tour.deleteMany();
    console.log('tours deleted successfully');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

// terminal
if (process.argv[2] === '--import') {
  importTours();
} else if (process.argv[2] === '--delete') {
  deleteTours();
}
