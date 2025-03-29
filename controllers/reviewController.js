const Review = require("../models/reviewsModel");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");

// Gets all reviews
exports.getAllReviews = catchAsync(async (req, res) => {
  let filter;
  if (req.params.tourId) {
    filter = { tour: req.params.tourId };
  }
  const reviews = await Review.find(filter);

  res.status(200).json({
    status: "success",
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.createReview = catchAsync(async (req, res) => {
  // Allow nested routes
  if (!req.body.tour) {
    req.body.tour = req.params.tourId;
  }
  if (!req.body.user) {
    req.body.user = req.user.id;
  }
  const { review, rating, tour } = req.body;
  const { user } = req;

  const newReview = await Review.create({
    review,
    rating,
    tour,
    user: user.id,
  });

  res.status(200).json({
    status: "succes",
    data: {
      review: newReview,
    },
  });
});

exports.updateReview = factory.updateOne(Review);

exports.deleteReview = factory.deleteOne(Review);
