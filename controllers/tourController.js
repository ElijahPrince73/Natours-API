const fs = require("fs");
const Tour = require("../models/tourModel");

// const toursFile = `${__dirname}/../dev-data/data/tours-simple.json`;

// const tours = JSON.parse(fs.readFileSync(toursFile));

exports.getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find();

    res.status(200).json({
      status: "success",
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "failed",
      message: error,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "failed",
      message: error,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        tour: newTour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};

exports.updatetour = (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      tour: "UPDATED TOUR HERE",
    },
  });
};

exports.deleteTour = (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      tour: "DELETED",
    },
  });
};
