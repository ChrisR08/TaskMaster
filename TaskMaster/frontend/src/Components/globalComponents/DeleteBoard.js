import React from "react";
import { useNavigate } from "react-router-dom";

// Express API URL
import apiURL from "../../apiConfig";

// Global State
import { useNavContext } from "../../hooks/useNavContext";
import { useTasksContext } from "../../hooks/useTasksContext";

// CSS
import "../TaskView/Delete.css";

function DeleteBoard() {
    // Making the Contexts avaliable
    const { dispatchNav } = useNavContext();

    const { taskBoardTitle, taskBoards, updateTaskBoards, dispatchTask } =
        useTasksContext();

    const navigate = useNavigate();

    // ========================================================================

    // Handle click cancel btn
    const handleCancelDelete = (e) => {
        e.preventDefault();
        dispatchNav({ type: `DELETEBOARD_OPEN`, payload: false });
    };

    // Handle submitting delete
    // DELETE request and state update to trigger render
    const handleDeleteBoard = async (e) => {
        e.preventDefault();

        // Getting the taskBoard _id for use in handleDeleteBoard
        const taskBoard = taskBoards.find((board) => board.taskBoard === taskBoardTitle);
        const taskBoard_Id = taskBoard._id;

        const updatedTaskBoards = taskBoards.filter(
            (board) => board.taskBoard !== taskBoardTitle
        );

        const updatedTaskBoardTitles = updatedTaskBoards.map((board) => board.taskBoard);

        console.log(taskBoard);

        // Triggers render to update tasks and taskBoardTitles
        dispatchTask({ type: `SET_ALLTASKBOARD_DATA`, payload: updatedTaskBoards });
        dispatchTask({ type: `SET_ALLTASKBOARDTITLES`, payload: updatedTaskBoardTitles });

        // If a taskBoard is present attempt to delete all tasks associated with it from db
        if (taskBoardTitle) {
            try {
                const response = await fetch(`${apiURL}/tasks/delete-all-tasks`, {
                    method: `DELETE`,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ taskBoard: taskBoardTitle }),
                });
                const data = await response.json();
            } catch (error) {
                console.log(error);
            }
        }

        // If a taskBoard id is present attempt to delete the taskBoard from db
        if (taskBoard_Id) {
            try {
                const response = await fetch(`${apiURL}/taskBoard/delete-taskBoard`, {
                    method: `DELETE`,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ taskBoard_id: taskBoard_Id }),
                });
                const data = await response.json();
                console.log(data);
            } catch (error) {
                console.log(error);
            }
        }

        // Triggers render to update tasks
        localStorage.setItem(`taskBoardTitle`, taskBoards[0].taskBoard);
        dispatchTask({
            type: `SET_TASKBOARDTITLE`,
            payload: taskBoards[0].taskBoard,
        });

        // Triggers render to update tasks
        dispatchTask({ type: `UPDATE_TASKBOARDS`, payload: !updateTaskBoards });
        dispatchTask({ type: `SET_ALLTASKBOARDTITLES`, payload: !updateTaskBoards });

        navigate(`/`);

        // Closes the modal
        handleCancelDelete(e);
    };

    // ========================================================================

    return (
        <div className="overlay flex">
            <div className="delete-card flex flex-col even-spacing-s border-radius-m">
                <h3 className="h-l text-error">Delete this board?</h3>
                <p className="delete-card-p body-l">
                    Are you sure you want to delete the{" "}
                    <span className="text-form">{taskBoardTitle}</span> board?
                </p>
                <p className="delete-card-p body-l">
                    This action will remove all columns and tasks and cannot be reversed.
                </p>
                <div className="flex flex-col even-spacing-s">
                    <button
                        type="submit"
                        className="delete-btn bg-error h-s text-white letter-spacing-s border-radius-l"
                        onClick={handleDeleteBoard}
                    >
                        Delete
                    </button>
                    <button
                        type="submit"
                        className="cancel-btn bg-secondary h-s text-primary letter-spacing-s border-radius-l"
                        onClick={handleCancelDelete}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeleteBoard;
