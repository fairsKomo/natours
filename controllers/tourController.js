const Tour = require('../models/tourModel');

exports.getAllTOurs = async (req, res) => {
  try {
    const queryObj = { ...req.query };
    const execlude = ['page', 'limit', 'sort', 'fields'];

    execlude.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    const query = Tour.find(JSON.parse(queryStr));

    const tours = await query;

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
