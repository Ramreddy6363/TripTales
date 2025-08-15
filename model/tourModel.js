const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, 'A tour must have name'],
      unique: true,
      trim: true,
      minlength: [5, 'Name must be at least 5 characters'],
      maxlength: [40, 'Name must be at most 40 characters'],
    },
    slug: String,
    duration: {
      type: Number,
      require: [true, 'A tour must have duration'],
    },
    maxGroupSize: {
      type: Number,
      require: [true, 'A true must have a group size'],
    },
    difficulty: {
      type: String,
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty must be either easy, medium, or difficult',
      },
    },
    ratingsAverage: { type: Number, default: 4.5 },
    ratingsQuantity: { type: Number, default: 0 },
    price: {
      type: Number,
      require: [true, 'A tour must have price'],
      min: [0, 'Price must be above 0'],
      max: [1000, 'Price must be below 1000'],
    },
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
    secreatTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtual: true },
  },
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

//Document Middleware : runs before .save() and .create()
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

//Query middleware
tourSchema.pre(/^find/, function (next) {
  this.find({ secreatTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  next();
});

//aggregation middleware
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secreatTour: { $ne: true } } });
  console.log(this.pipeline());
  next();
});
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
