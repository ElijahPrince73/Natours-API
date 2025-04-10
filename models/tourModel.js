const mongoose = require("mongoose");
const slugify = require("slugify");
// const User = require("./userModel");

const toursSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      unique: true,
      maxLength: [40, "A tour name must have less or equal then 40 characters"],
      minLength: [10, "A tour name must have more than 10 characters"],
      // validate: [validator.isAlpha, "Tour name must only contain characters"],
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
        values: ["easy", "medium", "hard", "difficult"],
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
    priceDiscount: {
      type: Number,
      validate: {
        message: "Discount price ({VALUE}) must be cheaper than price",
        validator: function (val) {
          // this only points to current document on NEW document creation not update
          return val < this.price; // 100 - 200
        },
      },
    },
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
    startLocation: {
      // GeoJson
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: "Point",
          enum: ["Point"],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
  },
  // Used to add virtuals
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

// Virttuals are used as a way to add data to the returned schema without it existing in the database. Mainly used for business logic.

toursSchema.index({ price: 1, ratingsAverage: 1 });
toursSchema.index({ slug: 1 });
toursSchema.index({ startLocation: "2dspheer" });

// Use regular function to gain access to the this keyword
toursSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

// Virtual Populate
// Naming the virtual field to populate in the controller
toursSchema.virtual("reviews", {
  ref: "Review",
  // Reference where this is stored in another model
  // Here we are specificy tour because its in the Review model
  foreignField: "tour",
  // Within the foreign field we are wanting it to look up the tour by the _id field
  localField: "_id",
});

// Document Middleware: runs BEFORE .save() method and .create()
toursSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Used to embed guides
// toursSchema.pre("save", async function (next) {
//   const guidesPromises = this.guides.map(async (id) => {
//     return await User.findById(id);
//   });

//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

// Document Middleware: runs AFTER .save() method and .create()
toursSchema.post("save", (doc, next) => {
  next();
});

// Query Middleware: runs BEFORE or AFTER .find() method

// In the middleware function, `this` refers to the query object. The line `this.find({ secretTour: { $ne: true } });` modifies the query to exclude documents where the `secretTour` field is set to `true`. The `$ne` operator stands for "not equal," so this ensures that only tours that are not secret are included in the results.

toursSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });

  this.start = Date.now();
  next();
});

toursSchema.pre(/^find/, function (next) {
  this.populate({
    path: "guides",
    select: "-__v -passwordChangedAt",
  });
  next();
});

// Aggregate middleware: runs BEFORE or AFTER aggregate()
toursSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

const Tour = mongoose.model("Tour", toursSchema);

module.exports = Tour;
