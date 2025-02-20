const express = require("express");
const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const { signup, login } = require("../controllers/authController");

const router = express.Router();

// POST request to handle user signup
// This route is used to create a new user account.
// The signup function will handle the logic for registering a new user.
router.post("/signup", signup);
router.post("/login", login);

// Using router.route to handle multiple requests on the same route
// This route handles GET and POST requests for the root URL ("/").
// GET request to fetch all users (getAllUsers function).
// POST request to create a new user (createUser function).
router.route("/").get(getAllUsers).post(createUser);

// GET request to fetch a specific user by ID (getUser function).
// PATCH request to update a specific user by ID (updateUser function).
// DELETE request to delete a specific user by ID (deleteUser function).
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
