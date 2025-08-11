const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, 'A tour must have name'],
    unique: true,
    trim: true,
  },
  duration: {
    type: Number,
    require: [true, 'A tour must have duration'],
  },
  maxGruopSize: {
    type: Number,
    require: [true, 'A true must have a group size'],
  },
  difficulty: {
    type: String,
    require: [true, 'A tour must have a difficulty'],
  },
  ratingsAverage: { type: Number, default: 4.5 },
  ratingsQuantity: { type: Number, default: 0 },
  price: { type: Number, require: [true, 'A tour must have price'] },
  PriceDiscount: Number,
  summary: {
    type: String,
    trim: true,
    require: [true, 'A tour must have a description'],
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    require: [true, 'A tour must have a cover image'],
  },
  image: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  startDates: [Date],
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
