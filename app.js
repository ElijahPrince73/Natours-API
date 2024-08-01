const express = require("express");
const morgan = require("morgan");

const toursRouter = require("./routes/toursRoutes");
const userRouter = require("./routes/userRoutes");

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
  const err = new Error(`Can't find ${req.originalUrl} on this server`);
  err.status = "fail";
  err.statusCode = 404;

  // Pass the newly created error to the next middleware
  // Express will always handle the error if given an argument in the next() function
  next(err);
});

// Global middleware to handle error responses
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

module.exports = app;
