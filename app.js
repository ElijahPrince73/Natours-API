const express = require("express");
const morgan = require("morgan");

const AppError = require("./utils/appError");

const toursRouter = require("./routes/toursRoutes");
const userRouter = require("./routes/userRoutes");
const globalErrorHandler = require("./controllers/errorController");

const app = express();

// Middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public/`));

app.use("/api/v1/tours", toursRouter);
app.use("/api/v1/users", userRouter);

// If we cant find the route
app.all("*", (req, res, next) => {
  // Pass the newly created error to the next middleware
  // Express will always handle the error if given an argument in the next() function
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// Global middleware to handle error responses
app.use(globalErrorHandler);

module.exports = app;
