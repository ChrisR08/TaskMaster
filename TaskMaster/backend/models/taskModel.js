const mongoose = require(`mongoose`);

const Schema = mongoose.Schema;

const taskSchema = new Schema(
    {
        user_ID: {
            type: String,
            required: true,
        },

        taskBoard: {
            type: String,
            required: true,
        },

        taskTitle: {
            type: String,
            trim: true,
            required: true,
            maxlength: 60,
        },

        taskDesc: {
            type: String,
            trim: true,
            required: false,
        },

        subtasks: [
            {
                title: {
                    type: String,
                    required: false,
                },
                completed: {
                    type: Boolean,
                    required: false,
                    default: false,
                },
            },
        ],

        taskStatus: {
            type: String,
            default: "todo",
            required: true,
        },
    },
    { collection: "tasks", db: "TaskMaster", timestamps: true }
);

taskSchema.pre("save", function (next) {
    // Validate the task
    if (!this.taskTitle) {
        return next(new Error("Task title is required"));
    }
    if (this.taskTitle && this.taskTitle.length > 60) {
        return next(new Error("Task title cannot be more than 60 characters"));
    }

    // Capitalize the first letter of taskBoard
    this.taskBoard = this.taskBoard.charAt(0).toUpperCase() + this.taskBoard.slice(1);

    // If validation passes, call next to continue saving the task
    next();
});

const Task = mongoose.model(`Task`, taskSchema);

module.exports = Task;
