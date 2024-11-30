const Tour = require('../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const appError = require('../utils/appError');
const AppError = require('../utils/appError');

exports.alisTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingAverage,price';
  req.query.fields = 'duration,name,price,ratingAverage,description';
  next();
};

exports.getAllTOurs = catchAsync(async (req, res, next) => {
    // Executing the query
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await features.query;

    res.status(200).send({
      status: 'succes',
      results: tours.length,
      data: { tours },
    });
});

exports.getTour = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const tour = await Tour.findById(id);
    if(!tour) {
      return next(new AppError('Tour was not found', 404));
    }
    res.status(200).send({ status: 'succes', data: { tour } });
});

exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: 'Success',
    data: { tour: newTour },
  });
});

exports.updateTour = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const tour = await Tour.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if(!tour) {
      return next(new AppError('Tour was not found', 404));
    }

    return res.status(200).json({ status: 'Success', data: { tour } });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const tour = await Tour.findByIdAndDelete(id);

    if(!tour) {
      return next(new AppError('Tour was not found', 404));
    }

    return res.status(204).json({ status: 'Success', data: null });
});

exports.getTourStats = catchAsync(async (req, res, next) => {
    const stats = await Tour.aggregate([
      { $match: { ratingAverage: { $gte: 4.5 } } },
      {
        $group: {
          _id: '$difficulty',
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingQuantity' },
          avgRating: { $avg: '$ratingAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      { $sort: { avgPrice: -1 } },
    ]);

    if (stats.length === 0) {
      return res.status(200).json({
        status: 'Success',
        message: 'No tours found with the specified criteria.',
        data: { stats: null },
      });
    }

    res.status(200).json({
      status: 'Success',
      data: { stats },
    });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => { 
    const year = req.params.year * 1;
    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates'
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: {$month: '$startDates'},
          numOfTours: {$sum: 1},
          tours: {$push: '$name'},
        },
      },
      {
        $addFields: {
          month: '$_id'
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
      {
        $sort: {numOfTours: -1},
      },
    ]);
    
    if (plan.length === 0) {
      return res.status(200).json({
        status: 'Success',
        message: 'No tours found with the specified criteria.',
        data: { stats: null }
      });
    }
    
    res.status(200).json({
      status: 'Success',
      data: { plan }
    });
});



exports.grtMonthlyPlan = catchAsync(async (req, res, next) => {
    const year = req.params.year * 1;

    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates',
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numTourStarts: { $sum: 1 },
          tours: { $push: '$name' },
        },
      },
      {
        $addFields: { month: '$_id' },
      },
      {
        $project: { _id: 0 },
      },
      {
        $sort: {
          numTourStarts: -1,
        },
      },
    ]);

    res.status(200).json({
      status: 'Success',
      data: { plan },
    });
});