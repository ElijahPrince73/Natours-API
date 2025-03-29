const mongoose = require("mongoose");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

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
