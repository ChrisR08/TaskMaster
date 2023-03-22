// Import express
const express = require(`express`);

// Import express router
const router = express.Router();

// Import controller functions
const {
    getUsers,
    updateAdminStatus,
    deleteUser,
} = require(`../controllers/adminController`);

// Import controller functions
const { verifyToken } = require(`../controllers/authController`);

// Import middleware
const { checkContentType } = require(`../middleware/middleware`);

// Checks all requests are correct content type
router.use("/*", checkContentType);

// // Checks all - Verfies user is authorised
router.use("/*", verifyToken);

// POST - Gets all users
router.post("/get-users", getUsers);

// PUT - Update user admin status
router.put("/update-admin-status", updateAdminStatus);

// DELETE - Delete a user and their tasks/taskBoards
router.delete("/delete-user", deleteUser);

module.exports = router;
