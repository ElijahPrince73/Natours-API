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

const { protect, restrictTo } = require("../controllers/authController");

router.route("/monthly-plan/:year").get(getMonthlyPlan);

router.route("/tour-stats").get(getTourStats);

router.route("/top-5-cheap").get(aliasTopTours, getAllTours);

// Middleware to handle the protected routes
// The protect middleware will check if the user is logged in.
// If the user is logged in, the protect middleware will call the next function.
// If the user is not logged in, the protect middleware will return an error.
router.route("/").get(protect, getAllTours).post(createTour);

router
  .route("/:id")
  .get(getTour)
  .patch(updatetour)
  .delete(protect, restrictTo("admin", "lead-guide"), deleteTour);

module.exports = router;
