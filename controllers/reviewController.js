const Review = require("../models/reviewsModel");
const catchAsync = require("../utils/catchAsync");

// Gets all reviews
exports.getAllReviews = catchAsync(async (req, res) => {
  const reviews = await Review.find();

  res.status(200).json({
    status: "success",
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.createReview = catchAsync(async (req, res) => {
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
