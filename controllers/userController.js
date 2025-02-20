const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");

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

exports.updateUser = (req, res) => {
  res.status(500);
};

exports.deleteUser = (req, res) => {
  res.status(500);
};
