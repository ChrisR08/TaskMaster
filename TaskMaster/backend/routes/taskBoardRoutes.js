// TaskBoard Routes

// Import express
const express = require(`express`);

// Import express router
const router = express.Router();

// Import controller functions
const {
    createTaskBoard,
    getAllTaskBoards,
    editTaskBoard,
    deleteTaskBoard,
} = require(`../controllers/taskBoardController`);

// Import controller functions
const { verifyToken } = require(`../controllers/authController`);

// Import middleware
const { checkContentType } = require(`../middleware/middleware`);

// Checks all requests are correct content type
router.all("/*", checkContentType);

// // Checks all - Verfies user is authorised before allowing requests to the db
router.use("/*", verifyToken);

// POST - Adds a new taskBoard to the database
router.post("/create-taskBoard", createTaskBoard);

// POST - Gets the taskBoards from db
router.post("/get-taskBoards", getAllTaskBoards);

// PUT - Edits a single TaskBoard
router.put("/edit-taskBoard", editTaskBoard);

// DELETE - Delete a TaskBoard from db
router.delete("/delete-taskBoard", deleteTaskBoard);

module.exports = router;
