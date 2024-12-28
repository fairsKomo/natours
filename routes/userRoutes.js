const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.route('/signUp').post(authController.signUp);

router.route('/login').post(authController.login);

router.route('/forgetPassword').post(authController.forgotPassword);

router.route('/resetPassword/:resetToken').patch(authController.resetPassword);

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/updateMe')
  .patch(authController.protect, userController.updateMe);

router
  .route('/deleteMe')
  .delete(authController.protect, userController.deletMe);

router
  .route('/updatePassword')
  .patch(authController.protect, authController.updatePassword);

router
  .route('/users/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
