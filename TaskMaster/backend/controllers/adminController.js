// Admin Controller

// Import user and taskBoard models
const User = require("../models/userModel");
const Task = require("../models/taskModel");
const TaskBoard = require("../models/taskBoardModel");

// POST =======================================================================

// Gets all users
const getUsers = async (req, res) => {
    try {
        // Exclude password from users return
        const users = await User.find({}, "-password");
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// PUT ========================================================================

// Update user admin status
const updateAdminStatus = async (req, res) => {
    const { userId, isAdmin } = req.body;
    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { admin: isAdmin },
            { new: true }
        );
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// DELETE =====================================================================

// Delete a user and their tasks/taskBoards from the db
const deleteUser = async (req, res) => {
    const { userId } = req.body;

    try {
        // Delete all tasks with the corresponding user_ID
        await Task.deleteMany({ user_ID: userId });

        // Delete all taskBoards with the corresponding user_ID
        await TaskBoard.deleteMany({ user_ID: userId });

        // Delete the user
        await User.findByIdAndDelete(userId);

        res.status(200).json({
            message: "User and tasks deleted successfully.",
        });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user and tasks." });
    }
};

// Export functions for use in routes
module.exports = {
    getUsers,
    updateAdminStatus,
    deleteUser,
};
