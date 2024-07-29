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
  res.status(404).json({
    status: "fail",
    message: ` Can't find ${req.originalUrl} on this server`,
  });
});

module.exports = app;
