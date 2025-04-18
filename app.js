const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

const AppError = require("./utils/appError");

const toursRouter = require("./routes/toursRoutes");
const userRouter = require("./routes/userRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const globalErrorHandler = require("./controllers/errorController");
const compression = require("compression");

const app = express();

// GLOBAL Middleware
// Security HTTP headers
app.use(helmet());

// Dev Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Rate Limiter
// Within an hour specify how many times the server can be accessed from an IP address.
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many request from this IP, please try again in an hour",
});

app.use("/api", limiter);

// Body parser, reading data from body to req.body
app.use(
  express.json({
    limit: "10kb",
  })
);

// Data sanitization against noSQl query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter poluttion
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuality",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);

// Serving static files
app.use(express.static(`${__dirname}/public/`));

app.use(compression());

// API Routes
app.use("/api/v1/tours", toursRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);

// If we cant find the route
app.all("*", (req, res, next) => {
  // Pass the newly created error to the next middleware
  // Express will always handle the error if given an argument in the next() function
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// Global middleware to handle error responses
app.use(globalErrorHandler);

module.exports = app;
