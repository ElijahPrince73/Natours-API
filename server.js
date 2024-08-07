const dotenv = require("dotenv");
const mongoose = require("mongoose");

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION, shutting down");
  console.log(err.name, err.message);
  process.exit(1);
});

const app = require("./app");

dotenv.config({
  path: "./config.env",
});

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB).then(() => {
  console.log("Database connected");
});

const port = process.env.PORT || 3000;

// Server
const server = app.listen(port, () => {
  console.log(`App running on port: ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION, shutting down");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
