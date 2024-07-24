const mongoose = require("mongoose");
const slugify = require("slugify");

const toursSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      unique: true,
      maxLength: [40, "A tour name must have less or equal then 40 characters"],
      minLength: [10, "A tour name must have more than 10 characters"],
    },
    slug: {
      type: String,
    },
    duration: {
      type: Number,
      required: [true, "A tour must have a duration"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have a group size "],
    },
    difficulty: {
      type: String,
      required: [true, "A tour must have a difficulty"],
      // Enums are only for strings
      enum: {
        values: ["easy", "medium", "hard"],
        message: "Difficulty must be easy, medium, or hard",
      },
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      // min and max can work for dates
      min: [1, "Rating must be above 1"],
      max: [5, "Rating must be below 5"],
    },
    price: {
      type: Number,
      required: [true, "A tour must have a price"],
    },
    priceDiscount: Number,
    summary: {
      type: String,
      trim: [true, "A tour must have a summary"],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, "A tour must have a cover image"],
    },
    images: {
      type: [String],
    },
    createdAt: {
      type: Date,
      default: Date.now,
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  // Used to add virtuals
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  },
);

// Virttuals are used as a way to add data to the returned schema without it existing in the database. Mainly used for business logic.

// Use regular function to gain access to the this keyword
toursSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

// Document Middleware: runs BEFORE .save() method and .create()
toursSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Document Middleware: runs AFTER .save() method and .create()
toursSchema.post("save", (doc, next) => {
  console.log(doc);
  next();
});

// Query Middleware: runs BEFORE or AFTER .find() method
toursSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });

  this.start = Date.now();
  next();
});

toursSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} miliseconds`);
  console.log(docs);
  next();
});

// Aggregate middleware: runs BEFORE or AFTER aggregate()
toursSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

const Tour = mongoose.model("Tour", toursSchema);

module.exports = Tour;
