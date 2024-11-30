const mongoose = require('mongoose');
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is Required'],
    unique: true,
    trim: true,
    maxLength: [40, 'Name should be 40 chars at most'],
    minLength: [10, 'Name should be 10 chars at least'],
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
    enum:{
      values: ['easy', 'medium', 'difficult'],
      message: 'Difficulty should {easy, medium or hard}'
    }
  },
  ratingAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'Rating should be 1 at least'],
    max: [5, 'Rating should be 5 at most']
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
    validate:{
      validator: function(val){
        return val < this.price;
      },
      message: 'Price Discount (VALUE) cannot be greater than the price',
    }
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
