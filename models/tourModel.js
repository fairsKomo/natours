const mongoose = require('mongoose');
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  duration: {
    type: Number,
    required: [true, 'A tour must have a duration'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a Group Size'],
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have a difiiculty'],
  },
  ratingAverage: {
    type: Number,
    default: 4.5,
  },
  ratingQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: true,
  },
  priceDiscount: {
    type: Number,
  },
  summary: {
    type: String,
    trim: true,
    required: [true, 'A tour mus have a summary'],
  },
  description: {
    type: String,
    trim: true,
    required: [true, 'A tour mus have a description'],
  },
  imageCover: {
    type: String,
    trim: true,
    required: [true, 'A tour mus have a cover image'],
  },
  images: {
    type: [String],
    trim: true,
    required: [true, 'A tour mus have a images'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  startDates: {
    type: [Date],
  },
  secretTour:{
    type: Boolean,
    default: false,
  },
});

// QUERY MIDDLEWARE

tourSchema.pre(/^find/, function(next){
  this.find({secretTour: {$ne: true}});

  this.start = Date.now();

  next();
});

tourSchema.post(/^find/, function(doc, next){
  console.log(`It took ${Date.now() - this.start} millisecondes to complete`);

  next();
});

// AGGREGATION MIDDLEWARE

tourSchema.pre('aggregate', function(next){
  this.pipeline().unshift({$match: {secretTour: {$ne: true}}});
  next();
})

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
