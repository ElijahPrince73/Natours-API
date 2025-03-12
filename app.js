const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const AppError = require("./utils/appError");

const toursRouter = require("./routes/toursRoutes");
const userRouter = require("./routes/userRoutes");
const globalErrorHandler = require("./controllers/errorController");

const app = express();

// GLOBAL Middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Within an hour specify how many times the server can be accessed from an IP address.
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many request from this IP, please try again in an hour",
});

app.use("/api", limiter);

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
