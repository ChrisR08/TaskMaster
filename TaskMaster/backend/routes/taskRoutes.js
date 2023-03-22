// Task Routes

// Import express
const express = require(`express`);

// Import express router
const router = express.Router();

// Import controller functions
const {
    createTask,
    getTasks,
    getAllTasks,
    editTask,
    editAllTasks,
    deleteTask,
    deleteAllTasks,
} = require(`../controllers/taskController`);

// Import controller functions
const { verifyToken } = require(`../controllers/authController`);

// Import middleware
const { checkContentType, verifyTokenRoutes } = require(`../middleware/middleware`);

// Checks all requests are correct content type
router.all("/*", checkContentType);

// // Checks all - Verfies user is authorised
router.use("/*", verifyToken);

// POST - Adds a new taskBoard to the database
router.post("/create-task", createTask);

// POST - Gets the tasks for a users taskBoard from db
router.post("/get-tasks", getTasks);

// POST - Gets all the tasks for a user from db
router.post("/get-all-tasks", getAllTasks);

// PUT - Edits a single task
router.put("/edit-task", editTask);

// PUT - Edits all tasks
router.put("/edit-all-tasks", editAllTasks);

// DELETE - Delete a task from db
router.delete("/delete-task", deleteTask);

// DELETE - Delete all task from db with specific taskBoard
router.delete("/delete-all-tasks", deleteAllTasks);

module.exports = router;
