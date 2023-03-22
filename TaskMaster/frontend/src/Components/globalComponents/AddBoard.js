// ADD BOARD MODAL
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Express API URL
import apiURL from "../../apiConfig";

// Global State
import { useTasksContext } from "../../hooks/useTasksContext";
import { useNavContext } from "../../hooks/useNavContext";
import { useUserContext } from "../../hooks/useUserContext";

function AddBoard() {
    // Making the Contexts avaliable
    const { updateTaskBoards, dispatchTask } = useTasksContext();

    const { addBoardOpen, dispatchNav } = useNavContext();

    const { userId } = useUserContext();

    const navigate = useNavigate();

    // ========================================================================

    // Setting up the useState for the input
    const [formData, setFormData] = useState({
        taskBoard: "",
    });

    // Setting up the useState for error handling
    const [errors, setErrors] = useState({
        titleError: "",
    });

    // ========================================================================

    // Form handling: Submit/Close

    // Handle click cancel btn
    const handleCancelAddBoard = (e) => {
        e.preventDefault();
        // Resets the add subtask input/array to empty if modal closed without editing
        dispatchNav({ type: `ADDBOARD_OPEN`, payload: !addBoardOpen });
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
    let newTaskBoard = formData.taskBoard.trim();

    // Submit Form
    const submitAddTaskboard = async (e) => {
        e.preventDefault();

        // Capitalize the first letter of taskBoard
        newTaskBoard = newTaskBoard.charAt(0).toUpperCase() + newTaskBoard.slice(1);

        // If the values exist then attempt the PUT request
        if (
            userId &&
            newTaskBoard &&
            newTaskBoard.length > 0 &&
            newTaskBoard.length < 40
        ) {
            try {
                const response = await fetch(`${apiURL}/taskBoard/create-taskBoard`, {
                    method: `POST`,
                    headers: {
                        "Content-type": "application/json",
                    },
                    // To be sent in the body to the backend
                    body: JSON.stringify({
                        user_ID: userId,
                        taskBoard: newTaskBoard,
                    }),
                });
                const data = await response.json();
                console.log(data);
                // Handle errors & display to user
                if (data.error) {
                    setErrors({
                        titleError: data.error,
                    });
                } else if (!data.error) {
                    localStorage.setItem("taskBoardTitle", newTaskBoard);

                    dispatchTask({
                        type: `SET_TASKBOARDTITLE`,
                        payload: newTaskBoard,
                    });

                    // Send user to the board they created
                    navigate(`/tasks`);

                    // Close modal
                    handleCancelAddBoard(e);
                }
            } catch (error) {
                console.log(error);
            }
        } else {
            setErrors({
                titleError: `Title needs to be greater than 0 and less than 40 characters.`,
            });
        }

        localStorage.setItem("taskBoardTitle", newTaskBoard);

        dispatchTask({
            type: `SET_TASKBOARDTITLE`,
            payload: newTaskBoard,
        });

        // Trigger re-render
        dispatchTask({ type: `UPDATE_TASKBOARDS`, payload: !updateTaskBoards });
    };

    // ========================================================================

    return (
        <>
            {addBoardOpen && (
                <>
                    <div className="overlay flex">
                        {/* Edit Form */}
                        <form className="edit-task-form border-radius-s even-spacing-m">
                            <h3 className="h-l form-title">Add TaskBoard</h3>

                            {/* Close Button*/}
                            <button
                                className="close-form-btn flex align-center"
                                type="button"
                                onClick={handleCancelAddBoard}
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
                                    className="add-input body-l border-radius-s"
                                    type="text"
                                    name="taskBoard"
                                    placeholder="Add a new board title"
                                    value={formData.taskBoard}
                                    autoComplete="name"
                                    onChange={handleInputs}
                                    required
                                    minLength={1}
                                    maxLength={39}
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
                                    onClick={submitAddTaskboard}
                                >
                                    Add Board
                                </button>
                            </div>
                        </form>
                    </div>
                </>
            )}
        </>
    );
}

export default AddBoard;
