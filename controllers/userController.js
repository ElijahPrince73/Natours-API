const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});

exports.createUser = (req, res) => {
  res.status(500);
};

exports.getUser = (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      tour: "DELETED",
    },
  });
};

exports.updateMe = catchAsync(async (req, res, next) => {
  const { password, passwordConfirm } = req.body;
  const { user } = req;
  // 1) Create error if user POSTs password data
  if (password || passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates, please use /updateMyPassword",
        400
      )
    );
  }
  // 2) Filter out unwanted field names that are not allowed to be updated
  const filteredBody = filterObj(req.body, "name", "email");

  // 3) Update user
  const updatedUser = await User.findByIdAndUpdate(user._id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  const { user } = req;

  await User.findByIdAndUpdate(user._id, {
    active: false,
  });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.updateUser = factory.updateOne(User);

exports.deleteUser = factory.deleteOne(User);
