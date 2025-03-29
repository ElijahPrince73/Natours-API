const mongoose = require("mongoose");
const Tour = require("../models/tourModel");
const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

exports.aliasTopTours = async (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAvergage,price";
  req.query.fields = "name, price, ratingsAvergage, summary, difficulty";
  next();
};

exports.getAllTours = catchAsync(async (req, res) => {
  // BUILD THE QUERY
  // 1 Filtering
  const queryObj = { ...req.query };
  const excludedFieds = ["page", "sort", "limit", "fields"];

  excludedFieds.forEach((el) => delete queryObj[el]);

  // EXECUTE THE QUERY
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const tours = await features.query;

  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      tours,
    },
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  if (!isValidObjectId(req.params.id))
    return next(new AppError(`The tour is not found with the id.`, 404));

  // if we use .populate on a find it basically looks at the id's in an array and populates them with data on request. Using the populate is also a request and can slow down the application if we have huge queries.

  // const tour = await Tour.findById(req.params.id).populate("guides");

  // We can specify what fields we want to remove from the incoming child documents with a object and select
  // const tour = await Tour.findById(req.params.id).populate({
  //   path: "guides",
  //   select: "-__v -passwordChangedAt",
  // });

  const tour = await Tour.findById(req.params.id).populate("reviews");

  // For looking up things as well
  // Tour.findOne({ _id: req.params.id})
  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
});

exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      tour: newTour,
    },
  });
});

exports.updatetour = catchAsync(async (req, res, next) => {
  if (!isValidObjectId(req.params.id))
    return next(new AppError(`The tour is not found with the id.`, 404));

  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    // this setting makes sure that the tour validators are run again
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
});

exports.deleteTour = factory.deleteOne(Tour);

// exports.deleteTour = catchAsync(async (req, res, next) => {
//   if (!isValidObjectId(req.params.id))
//     return next(new AppError(`The tour is not found with the id.`, 404));

//   const tour = await Tour.findByIdAndDelete(req.params.id);

//   res.status(204).json({
//     status: "success",
//     data: {
//       tour,
//     },
//   });
// });

exports.getTourStats = catchAsync(async (req, res) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: "$difficulty",
        numTours: { $sum: 1 },
        numRatings: { $sum: "ratingsQuantity" },
        avgRating: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res) => {
  const { year } = req.params;
  const plan = await Tour.aggregate([
    {
      $unwind: "$startDates",
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$startDates" },
        numOfToursStarts: { $sum: 1 },
        tours: { $push: "$name" },
      },
    },
    {
      $addFields: { month: "$_id" },
    },
    {
      $project: { _id: 0 },
    },
    { $sort: { numOfToursStarts: -1 } },
    {
      $limit: 12,
    },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      plan,
    },
  });
});
