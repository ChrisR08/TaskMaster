// Task Controller

// Import Schema models
const User = require(`../models/userModel`);
const Task = require(`../models/taskModel`);

// POST =======================================================================

// Adds a new task to the database =======================================
const createTask = async (req, res) => {
    // Destructure the body data
    const { user_ID, task } = req.body;

    // Check the user_ID is found in the db
    const user = await User.findOne({ _id: user_ID });

    if (!user) {
        return res.status(404).json({
            error: "User ID not found.",
        });
    }
    // Check if task title is valid
    if (
        !task.taskTitle ||
        task.taskTitle.trim().length === 0 ||
        task.taskTitle.trim().length > 60
    ) {
        return res.status(400).json({
            error: "Invalid task title. Must be greater than 0 and less than or equal to 60 characters.",
        });
    }

    try {
        // Create new task in db
        const newTask = await Task.create({
            user_ID: user_ID.trim(),
            taskBoard: task.taskBoard.trim(),
            taskTitle: task.taskTitle.trim(),
            taskDesc: task.taskDesc.trim() || "",
            subtasks: task.subtasks || [],
            taskStatus: task.taskStatus.trim(),
        });
        // Send response with new task
        res.status(201).json({ newTask });
    } catch (error) {
        // Handle errors
        res.status(400).json({ error: error.message });
    }
};

// ============================================================================

// Gets the users task for the current taskBoard
const getTasks = async (req, res) => {
    // Destructure the body data
    const { taskBoard, user_ID } = req.body;
    console.log(`exectued controller get tasks`);

    // If not null then try to edit TaskBoard
    if (taskBoard && user_ID) {
        try {
            // Get all TaskBoards and return if not null
            const userTasks = await Task.find({ taskBoard: taskBoard, user_ID: user_ID });

            if (userTasks.length > 0) {
                res.status(200).json({ userTasks });
            }

            // If empty array, return error
            if (userTasks.length === 0) {
                return res.status(404).json({ error: "No tasks found" });
            }
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    } else {
        if (!user_ID) {
            return res.status(400).json({ error: "No user ID" });
        } else {
            return res.status(400).json({ error: "No TaskBoard Title" });
        }
    }
};

// Gets the users task for the current taskBoard
const getAllTasks = async (req, res) => {
    // Destructure the body data
    const { user_ID } = req.body;
    console.log(`exectued controller get all tasks`);

    // If not null then try to edit TaskBoard
    if (user_ID) {
        try {
            // Get all TaskBoards and return if not null
            const allUserTasks = await Task.find({ user_ID: user_ID });

            if (allUserTasks.length > 0) {
                res.status(200).json({ allUserTasks });
            }

            // If empty array, return error
            if (allUserTasks.length === 0) {
                return res.status(404).json({ error: "No tasks found" });
            }
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    } else {
        if (!user_ID) {
            return res.status(400).json({ error: "No user ID" });
        } else {
            return res.status(400).json({ error: "No TaskBoard Title" });
        }
    }
};

// PUT ========================================================================

// Edits a single Task
const editTask = async (req, res) => {
    // Destructure the body data
    const { taskId, editedTask } = req.body;

    // Check if task title is valid
    if (
        !editedTask.taskTitle ||
        editedTask.taskTitle.trim().length === 0 ||
        editedTask.taskTitle.trim().length > 60
    ) {
        return res.status(400).json({
            error: "Invalid task title. Must be greater than 0 and less than or equal to 60 characters.",
        });
    }

    // If not null then try to edit Task
    if (taskId) {
        try {
            const updatedTask = await Task.findByIdAndUpdate(taskId, editedTask, {
                new: true,
            });
            console.log(updatedTask);
            // Get all Tasks and return if not null
            const tasks = await Task.find({});
            res.json({ tasks });
            // If null return error
            if (!updatedTask) {
                return res.status(404).json({ error: "Task not found" });
            }
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    } else {
        return res.status(400).json({ error: "No Task ID" });
    }
};

// Edit all tasks
const editAllTasks = async (req, res) => {
    const { taskBoardTitle, newTaskBoardTitle } = req.body;

    try {
        // Find all tasks with the given taskBoardTitle
        const tasks = await Task.find({ taskBoard: taskBoardTitle });

        // Update the taskBoard field for each task
        const updatedTasks = await Promise.all(
            tasks.map(async (task) => {
                task.taskBoard = newTaskBoardTitle;
                return await task.save();
            })
        );

        res.json({ tasks: updatedTasks });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// DELETE =====================================================================

// Delete a single taskBoard
const deleteTask = async (req, res) => {
    // Destructure the body data
    const { taskId, userId } = req.body;

    // If not null the try the delete method
    if (taskId && userId) {
        try {
            const deletedTask = await Task.findByIdAndDelete(taskId);
            const tasks = await Task.find({ user_ID: userId });

            if (tasks) {
                res.json({ tasks: tasks });
            }
            if (!deletedTask) {
                return res.status(404).json({ error: "Task not found" });
            }
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    } else if (!taskId) {
        return res.status(400).json({ error: "No Task ID sent" });
    } else if (!userId) {
        return res.status(400).json({ error: "No User ID sent" });
    }
};

// Delete all tasks with a specific taskBoard
const deleteAllTasks = async (req, res) => {
    const { taskBoard } = req.body;

    // If no id then return error
    if (!taskBoard) {
        return res.status(400).json({ error: "No taskBoard sent" });
    }

    try {
        const deletedTasks = await Task.deleteMany({ taskBoard: taskBoard });

        if (deletedTasks.deletedCount > 0) {
            return res.json({ message: "Tasks deleted successfully" });
        } else {
            return res.status(404).json({ error: "No tasks found for taskBoard" });
        }
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

// Export functions for use in routes
module.exports = {
    createTask,
    getTasks,
    getAllTasks,
    editTask,
    editAllTasks,
    deleteTask,
    deleteAllTasks,
};
