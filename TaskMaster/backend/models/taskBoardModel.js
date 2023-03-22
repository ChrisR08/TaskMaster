const mongoose = require(`mongoose`);

const Schema = mongoose.Schema;

const taskBoardSchema = new Schema(
    {
        user_ID: {
            type: String,
            required: true,
        },
        taskBoard: {
            type: String,
            required: true,
            maxlength: 40,
        },
    },
    { collection: "taskBoards", db: "TaskMaster", timestamps: true }
);

// Prevents errors as UI needs capitilisation
taskBoardSchema.pre("save", function (next) {
    // Capitalize the first letter of taskBoard
    this.taskBoard = this.taskBoard.charAt(0).toUpperCase() + this.taskBoard.slice(1);
    next();
});

const TaskBoard = mongoose.model(`taskBoard`, taskBoardSchema);

module.exports = TaskBoard;
