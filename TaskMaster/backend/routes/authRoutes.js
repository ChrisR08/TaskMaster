// Import express
const express = require(`express`);

// Import express router
const router = express.Router();

// Import controller functions
const {
    signUpUser,
    logInUser,
    logOutUser,
    verifyToken,
} = require(`../controllers/authController`);

// Import middleware
const { checkContentType } = require(`../middleware/middleware`);

// Checks all requests are correct content type
router.use("/*", checkContentType);

// Verfies user is authorised
router.use("/*", verifyToken);

// Verfies user is authorised
router.post("/verify-token", verifyToken);

// POST - Adds a new user to the database
router.post("/signup", signUpUser);

// POST - Verfies user login credentials
router.post("/login", logInUser);

// POST - Logs the user out
router.post("/logout", logOutUser);

module.exports = router;
