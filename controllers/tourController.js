const fs = require('fs');
const Tour = require('../models/tourModel');


exports.getAllTOurs = (req, res) => {
  console.log(req.requestTime);
  res.status(200).send({
    status: 'succes',
    // results: tours.length,
    // data: { tours },
  });
};

exports.getTour = (req, res) => {
  const id = req.params.id * 1;
  // const tour = tours.find((el) => el.id === id);
  // if (!tour) {
  //   return res.status(404).json({ status: 'Failed', message: 'invalid id' });
  // }
  // res.status(200).send({ status: 'succes', data: { tour } });
};

exports.createTour = (req, res) => {


  res.status(201).json({
    status: 'Success',
    data: { tour: newTour },
  });
};

exports.updateTour = (req, res) => {
  const id = req.params.id * 1;
  if (!tour) {
    return res.status(404).json({ status: 'Failed', message: 'invalid id' });
  }
  return res
    .status(200)
    .json({ status: 'Success', data: { tour: 'Updated tour here' } });
};

exports.deleteTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = 'Something' ;
  if (!tour) {
    return res.status(404).json({ status: 'Failed', message: 'invalid id' });
  }
  return res.status(204).json({ status: 'Success', data: null });
};
