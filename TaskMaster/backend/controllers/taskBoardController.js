// TaskBoard Controller

// Import Schema models
const User = require(`../models/userModel`);
const TaskBoard = require(`../models/taskBoardModel`);

// POST =======================================================================

// Adds a new taskBoard to the database =======================================
const createTaskBoard = async (req, res) => {
    // Destructure the body data
    const { user_ID, taskBoard } = req.body;

    // Check the user_ID is found in the db
    const user = await User.findOne({ _id: user_ID });

    if (!user) {
        return res.status(404).json({
            error: "User ID not found.",
        });
    }
    // Check if taskBoardTitle is valid
    if (!taskBoard || taskBoard.trim().length === 0 || taskBoard.length > 40) {
        return res.status(400).json({
            error: "Invalid taskboard title. Title must be greater than 0 and less than or equal to 40 characters.",
        });
    }
    try {
        // Create new taskBoard in db
        const newTaskBoard = await TaskBoard.create({ user_ID, taskBoard });
        res.status(201).json({ newTaskBoard });
    } catch (error) {
        // Handle errors
        res.status(400).json({ error: error.message });
    }
};

// ============================================================================

// Gets all the taskBoards
const getAllTaskBoards = async (req, res) => {
    // Destructure the body data
    const { user_ID } = req.body;
    console.log(`exectued controller get all task boards`);

    if (user_ID) {
        try {
            const taskBoards = await TaskBoard.find({ user_ID: user_ID });

            res.json({ taskBoards });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    } else {
        return res.status(404).json({
            error: "User ID not found.",
        });
    }
};

// PUT ========================================================================

// Edits a single TaskBoard
const editTaskBoard = async (req, res) => {
    // Destructure the body data
    const { taskBoard_id, newTaskBoardTitle } = req.body;
    if (newTaskBoardTitle.trim().length === 0 || newTaskBoardTitle.trim().length > 40) {
        return res.status(400).json({
            error: "Invalid task title. Must be greater than 0 and less than or equal to 40 characters.",
        });
    }
    // If not null then try to edit TaskBoard
    if (taskBoard_id) {
        try {
            const updatedTaskBoard = await TaskBoard.findByIdAndUpdate(
                taskBoard_id,
                { taskBoard: newTaskBoardTitle },
                { new: true }
            );
            // Get all TaskBoards and return if not null
            const taskBoards = await TaskBoard.find({});
            res.json({ taskBoards });
            // If null return error
            if (!updatedTaskBoard) {
                return res.status(404).json({ error: "TaskBoard not found" });
            }
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    } else {
        return res.status(400).json({ error: "No TaskBoard ID" });
    }
};

// ============================================================================

// DELETE =====================================================================

// Delete a single taskBoard
const deleteTaskBoard = async (req, res) => {
    // Destructure the body data
    const { taskBoard_id } = req.body;
    console.log(taskBoard_id);

    // If not null the try the delete method
    if (taskBoard_id) {
        try {
            const deletedTaskBoard = await TaskBoard.findByIdAndDelete(taskBoard_id);
            const taskBoards = await TaskBoard.find({});

            if (taskBoards) {
                res.json({ msg: `TaskBoard Deleted` });
            }
            if (!deletedTaskBoard) {
                return res.status(404).json({ error: "TaskBoard not found" });
            }
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    } else {
        return res.status(400).json({ error: "No TaskBoard ID sent" });
    }
};

// Export functions for use in routes
module.exports = {
    createTaskBoard,
    getAllTaskBoards,
    editTaskBoard,
    deleteTaskBoard,
};
