// EDIT BOARD MODAL
import React, { useState } from "react";

// Express API URL
import apiURL from "../../apiConfig";

// Global State
import { useTasksContext } from "../../hooks/useTasksContext";
import { useNavContext } from "../../hooks/useNavContext";

function EditBoard() {
    // Making the Contexts avaliable
    const { taskBoardTitle, taskBoards, updateTaskBoards, updateTasks, dispatchTask } =
        useTasksContext();
    const { editBoardOpen, dispatchNav } = useNavContext();

    // ========================================================================

    // Setting up the useState for the input
    const [formData, setFormData] = useState({
        taskBoard: taskBoardTitle,
    });

    // Setting up the useState for error handling
    const [errors, setErrors] = useState({
        titleError: "",
    });

    // ========================================================================

    // Form handling: Submit/Close

    // Handle click cancel btn
    const handleCancelEdit = (e) => {
        e.preventDefault();
        // Resets the add subtask input/array to empty if modal closed without editing
        dispatchNav({ type: `EDITBOARD_OPEN`, payload: !editBoardOpen });
    };

    // Form handling: Inputs

    // Gets the name of the input and the value and sets them in formData
    const handleInputs = (event) => {
        setErrors({
            titleError: "",
        });
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    // Trim any whitespace from title
    const newTaskBoardTitle = formData.taskBoard.trim();

    // Getting the taskBoard _id for use in submitEditTaskboard
    const taskBoard = taskBoards.find((board) => board.taskBoard === taskBoardTitle);
    const taskBoard_id = taskBoard._id;

    // Submit Form
    const submitEditTaskboard = async (e) => {
        e.preventDefault();

        // If the values exist then attempt the PUT request
        if (taskBoardTitle && newTaskBoardTitle) {
            try {
                const response = await fetch(`${apiURL}/tasks/edit-all-tasks`, {
                    method: `PUT`,
                    headers: {
                        "Content-type": "application/json",
                    },
                    // To be sent in the body to the backend
                    body: JSON.stringify({
                        taskBoardTitle: taskBoardTitle,
                        newTaskBoardTitle: newTaskBoardTitle,
                    }),
                });
                const data = await response.json();
            } catch (error) {
                console.log(error);
            }
        } else {
            setErrors({
                titleError: `Title needs to be greater than 0 and less than 40 characters.`,
            });
            console.log(`Titles incomplete. Could not attempt edit taskBoard`);
        }

        // If the values exist then attempt the PUT request
        if (taskBoard_id && formData.taskBoard) {
            try {
                const response = await fetch(`${apiURL}/taskBoard/edit-taskBoard`, {
                    method: `PUT`,
                    headers: {
                        "Content-type": "application/json",
                    },
                    // To be sent in the body to the backend
                    body: JSON.stringify({
                        taskBoard_id: taskBoard_id,
                        newTaskBoardTitle: formData.taskBoard,
                    }),
                });
                const data = await response.json();
            } catch (error) {
                console.log(error);
            }
        } else {
            setErrors({
                titleError: `Title needs to be greater than 0 and less than 40 characters.`,
            });
            console.log(`error`);
            console.log(errors.titleError);
            console.log(`Data incomplete. Could not attempt edit taskBoard`);
        }

        // Trigger re-render
        dispatchTask({ type: `UPDATE_TASKBOARDS`, payload: !updateTaskBoards });
        dispatchTask({ type: `UPDATE_TASKS`, payload: !updateTasks });

        // Close modal
        handleCancelEdit(e);
    };

    // ========================================================================

    return (
        <>
            {editBoardOpen && (
                <>
                    <div className="overlay flex">
                        {/* Edit Form */}
                        <form className="edit-task-form border-radius-s even-spacing-m">
                            <h3 className="h-l form-title">Edit Board Title</h3>

                            {/* Close Button*/}
                            <button
                                className="close-form-btn flex align-center"
                                type="button"
                                onClick={handleCancelEdit}
                            >
                                <svg
                                    className="close-form-svg"
                                    width="15"
                                    height="15"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <g fillRule="evenodd">
                                        <path d="m12.728 0 2.122 2.122L2.122 14.85 0 12.728z" />
                                        <path d="M0 2.122 2.122 0 14.85 12.728l-2.122 2.122z" />
                                    </g>
                                </svg>
                            </button>

                            {/* Title Form Group */}
                            <div className="form-group flex flex-col even-spacing-xs">
                                <label className="form-label h-s" htmlFor="taskBoard">
                                    Title
                                </label>
                                <input
                                    className="edit-input body-l border-radius-s"
                                    type="text"
                                    name="taskBoard"
                                    placeholder={taskBoardTitle.taskBoard}
                                    value={formData.taskBoard}
                                    autoComplete="name"
                                    onChange={handleInputs}
                                    required
                                />
                                {/* Displays title errors */}
                                {errors.titleError && errors.titleError !== "" && (
                                    <p className="error text-error">
                                        {errors.titleError}
                                    </p>
                                )}
                            </div>

                            {/* Edit / Delete Form Group */}
                            <div className="flex flex-col even-spacing-s">
                                <button
                                    type="submit"
                                    className="form-btn form-btn-primary bg-primary h-s text-white letter-spacing-s border-radius-l"
                                    onClick={submitEditTaskboard}
                                >
                                    Edit Board
                                </button>
                            </div>
                        </form>
                    </div>
                </>
            )}
        </>
    );
}

export default EditBoard;
