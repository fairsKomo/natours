const catchAsync = require('../utils/catchAsync');
const Users = require('../models/userModel');
const AppError = require('../utils/appError');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await Users.find();
  res
    .status(200)
    .json({ status: 'Success', results: users.length, data: users });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('This route is not for password changing!'));
  }

  const filteredBody = filterObj(req.body, 'name', 'email');

  const updatedUser = await Users.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: { updatedUser },
  });
});

exports.deletMe = catchAsync(async (req, res, next) => {
  await Users.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getUser = (req, res) => {
  res
    .status(500)
    .json({ status: 'Error', message: 'This Route has not been handled yet' });
};
exports.createUser = (req, res) => {
  res
    .status(500)
    .json({ status: 'Error', message: 'This Route has not been handled yet' });
};
exports.updateUser = (req, res) => {
  res
    .status(500)
    .json({ status: 'Error', message: 'This Route has not been handled yet' });
};
exports.deleteUser = (req, res) => {
  res
    .status(500)
    .json({ status: 'Error', message: 'This Route has not been handled yet' });
};
