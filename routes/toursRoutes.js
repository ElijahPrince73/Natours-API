const express = require("express");

const router = express.Router();

const {
  getAllTours,
  createTour,
  getTour,
  updatetour,
  deleteTour,
} = require("../controllers/tourController");

router.route("/").get(getAllTours).post(createTour);

router.route("/:id").get(getTour).patch(updatetour).delete(deleteTour);

module.exports = router;
