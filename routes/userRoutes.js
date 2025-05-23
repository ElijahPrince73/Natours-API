const express = require("express");
const {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
  getMe,
} = require("../controllers/userController");
const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  protect,
  restrictTo,
} = require("../controllers/authController");

const router = express.Router();
router.route("/me").get(protect, getMe, getUser);
// POST request to handle user signup
// This route is used to create a new user account.
// The signup function will handle the logic for registering a new user.

// AUTHENTICATION
router.post("/signup", signup);
router.post("/login", login);
router.patch("/resetPassword/:token", resetPassword);
router.post("/forgotPassword", forgotPassword);

// Protecting all routes after this middleware
router.use(protect);

// Routes
router.patch("/updateMyPassword", protect, updatePassword);

// USER UPDATE
router.patch("/updateMe", updateMe);
router.delete("/deleteMe", deleteMe);

// Using router.route to handle multiple requests on the same route
// This route handles GET and POST requests for the root URL ("/").
// GET request to fetch all users (getAllUsers function).
// POST request to create a new user (createUser function).

// Middleware for only admin access
router.use(restrictTo("admin"));

// Routes
router.route("/").get(getAllUsers);

// GET request to fetch a specific user by ID (getUser function).
// PATCH request to update a specific user by ID (updateUser function).
// DELETE request to delete a specific user by ID (deleteUser function).
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
