// ADD TASK BUTTON

// Importing the Global Context
import { useTasksContext } from "../../hooks/useTasksContext";
import { useNavContext } from "../../hooks/useNavContext";

import "./AddTaskBtn.css";

function AddTaskBtn({ pageTitle }) {
    // Making taskContext available
    const { addTaskOpen, taskBoards, dispatchTask } = useTasksContext();
    const { addBoardOpen, dispatchNav } = useNavContext();

    // Shows current Page/View Title
    let viewTitle = pageTitle;

    // ========================================================================

    // Disable primary nav button if page equals login or signup
    const disableBtn = (pageTitle) => {
        if (
            pageTitle.toLowerCase() === "log in" ||
            pageTitle.toLowerCase() === "sign up"
        ) {
            viewTitle = "TaskMaster";
            return true;
        } else return false;
    };

    // ========================================================================

    const toggleAddTask = () => {
        const userId = localStorage.getItem(`userId`);
        const taskBoard = localStorage.getItem(`taskBoardTitle`);

        if (!addTaskOpen) {
            dispatchTask({
                type: `SET_SELECTEDTASK`,
                payload: {
                    user_ID: userId,
                    taskBoard: taskBoard,
                    taskTitle: "",
                    taskDesc: "",
                    subtasks: [{ title: "", completed: false }],
                    taskStatus: "todo",
                },
            });
            dispatchTask({ type: `ADDTASK_OPEN`, payload: true });
        } else if (addTaskOpen) {
            dispatchTask({ type: `ADDTASK_OPEN`, payload: false });
        }
    };

    // ========================================================================

    // Open the add board modal
    const openAddBoard = () => {
        dispatchNav({ type: `ADDBOARD_OPEN`, payload: !addBoardOpen });
    };

    // ========================================================================

    return (
        <button
            className="add-task-btn grid border-radius-m"
            disabled={disableBtn(pageTitle)}
            onClick={taskBoards.length > 0 ? toggleAddTask : openAddBoard}
        >
            <img
                className="icon-plus"
                src="/icons/icon-add-task-mobile.svg"
                alt="Add task button"
            />
        </button>
    );
}

export default AddTaskBtn;
