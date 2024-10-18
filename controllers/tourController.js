const Tour = require('../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');
exports.alisTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingAverage,price';
  req.query.fields = 'duration,name,price,ratingAverage,description';
  next();
};

exports.getAllTOurs = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(404).json({ status: 'Failed', message: error.message });
  }
};

exports.getTour = async (req, res) => {
  try {
    const id = req.params.id;
    const tour = await Tour.findById(id);
    res.status(200).send({ status: 'succes', data: { tour } });
  } catch (error) {
    res.status(404).json({ status: 'Failed', message: error.message });
  }
};

exports.createTour = async (req, res) => {
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: 'Success',
    data: { tour: newTour },
  });
};

exports.updateTour = async (req, res) => {
  try {
    const id = req.params.id;
    const tour = await Tour.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    return res.status(200).json({ status: 'Success', data: { tour } });
  } catch (error) {
    res.status(404).json({ status: 'Failed', message: error.message });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    const id = req.params.id;
    const tour = await Tour.findByIdAndDelete(id);
    return res.status(204).json({ status: 'Success', data: null });
  } catch (error) {
    res.status(404).json({ status: 'Failed', message: error.message });
  }
};

exports.getTourStats = async (req, res) => { 
  try {
    const stats = await Tour.aggregate([
      { $match: { ratingAverage: { $gte: 4.5 } } },
      { $group: {
          _id: '$difficulty',
          numTours: {$sum: 1},
          numRatings: {$sum: '$ratingQuantity'},
          avgRating: { $avg: '$ratingAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      },
      {
        $sort : {avgPrice: -1}
      }
    ]);
    
    if (stats.length === 0) {
      return res.status(404).json({
        status: 'Success',
        message: 'No tours found with the specified criteria.',
        data: { stats: null }
      });
    }
    
    res.status(200).json({
      status: 'Success',
      data: { stats }
    });
  } catch (err) {
    res.status(404).json({ status: 'Failed', message: err.message });
  }
};

exports.getMonthlyPlan = async (req, res) => { 
  try {
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
  } catch (err) {
    res.status(404).json({ status: 'Failed', message: err.message });
  }
};



