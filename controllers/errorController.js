const AppError = require("../utils/appError");

// Global middleware to handle error responses
const sendErroDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error("----------------------ERROR-----------------------");
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

const handlecastErrorDB = (err) => {
  const messsage = `Invalid ${err.path}: ${err.value}`;
  return new AppError(messsage, 400);
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErroDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    if (error.name === "CastError") {
      error = handlecastErrorDB(err);
    }
    sendErrorProd(error, res);
  }
};
