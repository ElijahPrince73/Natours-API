// Description: This file contains the functions to handle the user authentication.
const { promisify } = require("util");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.signup = catchAsync(async (req, res) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role,
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: "success",
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }

  // 2) Check if user exists && password is correct
  // We need to select the password field because it is not returned by default
  const user = await User.findOne({ email }).select("+password");

  const correct = await user.correctPassword(password, user.password);

  if (!user || !correct) {
    return next(new AppError("Incorrect email or password", 401));
  }

  // 3) If everything is ok, send token to client

  const token = signToken(user._id);

  res.status(200).json({
    status: "success",
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  // 2) Verify the token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3 Check if user still exists
  const freshUser = await User.findById(decoded.id);

  if (!freshUser) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }
  // 4 Check if user changed password after the token was issued
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("Recently changed password! Please login again", 401)
    );
  }

  // 5 Grant access to protected route
  req.user = freshUser;
  next();
});

exports.restrictTo =
  // roles are only ever going to be array of admin or lead-guide


    (...roles) =>
    (req, res, next) => {
      console.log(req.user.role);
      // if req.user.role = user throw error
      if (!roles.includes(req.user.role)) {
        return next(
          new AppError("You dont have permission to perform this action", 403)
        );
      }

      next();
    };
