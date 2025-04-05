const mongoose = require("mongoose");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const APIFeatures = require("../utils/apiFeatures");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError(`The document found with that id.`, 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    if (!isValidObjectId(req.params.id))
      return next(new AppError(`The doc is not found with the id.`, 404));

    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      // this setting makes sure that the Model validators are run again
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      data: {
        doc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        doc,
      },
    });
  });

// if we use .populate on a find it basically looks at the id's in an array and populates them with data on request. Using the populate is also a request and can slow down the application if we have huge queries.

// const tour = await Tour.findById(req.params.id).populate("guides");

// We can specify what fields we want to remove from the incoming child documents with a object and select
// const tour = await Tour.findById(req.params.id).populate({
//   path: "guides",
//   select: "-__v -passwordChangedAt",
// });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);

    if (popOptions) {
      query = query.populate(popOptions);
    }

    const doc = await query;

    if (!doc)
      return next(new AppError(`The document is not found with the id.`, 404));

    res.status(200).json({
      status: "success",
      data: {
        doc,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res) => {
    // To allow for nested GET reviews on tour
    let filter;
    if (req.params.tourId) {
      filter = { tour: req.params.tourId };
    }

    // BUILD THE QUERY
    // 1 Filtering
    const queryObj = { ...req.query };
    const excludedFieds = ["page", "sort", "limit", "fields"];

    excludedFieds.forEach((el) => delete queryObj[el]);

    // EXECUTE THE QUERY
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const doc = await features.query.explain();

    // SEND RESPONSE
    res.status(200).json({
      status: "success",
      results: doc.length,
      data: {
        doc,
      },
    });
  });
