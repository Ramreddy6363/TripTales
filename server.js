const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require(`./app`);

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Db connecton successful');
  });

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, 'A tour must have name'],
    unique: true,
  },
  rating: { type: Number, default: 4.5 },
  price: { type: Number, require: [true, 'A tour must have price'] },
});

const Tour = mongoose.model('Tour', tourSchema);

const testTour = new Tour({
  name: 'The PARK CMPER',
  rating: 4.6,
  price: 5000,
});

testTour
  .save()
  .then((doc) => console.log(doc))
  .catch((err) => console.log("Error:",err));
const port = process.env.PORT;
app.listen(port, '127.0.0.1', () => {
  console.log(`App running on port ${port}`);
});
