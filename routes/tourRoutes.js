const express = require('express');
const tourController = require('../controllers/tourController');

const router = express.Router();

router.route('/top-cheap').get(tourController.alisTopTours, tourController.getAllTOurs)

router
  .route('/')
  .get(tourController.getAllTOurs)
  .post(tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
