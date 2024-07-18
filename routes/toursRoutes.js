const express = require("express");

const router = express.Router();

const {
  aliasTopTours,
  getAllTours,
  createTour,
  getTour,
  updatetour,
  deleteTour,
  getTourStats,
  getMonthlyPlan,
} = require("../controllers/tourController");

router.route("/monthly-plan/:year").get(getMonthlyPlan);

router.route("/tour-stats").get(getTourStats);

router.route("/top-5-cheap").get(aliasTopTours, getAllTours);

router.route("/").get(getAllTours).post(createTour);

router.route("/:id").get(getTour).patch(updatetour).delete(deleteTour);

module.exports = router;
