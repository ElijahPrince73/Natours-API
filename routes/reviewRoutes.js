const express = require("express");

// We use { mergeParams: true } so that way we can gain access to params on other routers that are using this reviews router like the one in tours.
const router = express.Router({ mergeParams: true });

// POST /tour/sdfs23df3/reviews
// So if we get a route like the one above express will automatically redirect it to the reviews router.  We can now gain access to the tourId param

const {
  getAllReviews,
  createReview,
} = require("../controllers/reviewController");

const { protect, restrictTo } = require("../controllers/authController");

router
  .route("/")
  .get(protect, getAllReviews)
  .post(protect, restrictTo("user"), createReview);

module.exports = router;
