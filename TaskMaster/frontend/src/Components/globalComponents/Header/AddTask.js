// ADD TASK MODAL
import React, { useState } from "react";
import { useLocation } from "react-router-dom";

// Express API URL
import apiURL from "../../../apiConfig";

// Global State
import { useTasksContext } from "../../../hooks/useTasksContext";

// CSS
import "../../TaskView/EditTask.css";
import "./AddTask.css";

function AddTask() {
    // Making the Contexts avaliable
    const {
        addTaskOpen,
        addSubtaskArray,
        selectedTask,
        taskBoards,
        allTaskBoardTitles,
        updateTasks,
        dispatchTask,
    } = useTasksContext();

    // ========================================================================

    // Gets the current path to use to conditionally render elements
    const location = useLocation();
    const currentUrl = location.pathname;

    // ========================================================================

    // Setting up the useState for the data from inputs in the login form
    const [formData, setFormData] = useState({
        user_ID: selectedTask.user_ID,
        taskBoard: selectedTask.taskBoard,
        taskTitle: selectedTask.taskTitle,
        taskDesc: selectedTask.taskDesc,
        subtasks: selectedTask.subtasks,
        taskStatus: selectedTask.taskStatus,
    });

    // Setting up the useState for error handling
    const [errors, setErrors] = useState({
        titleError: "",
    });

    // ========================================================================

    // Form handling: Inputs

    // Gets the name of the input and the value and sets them in formData
    const handleInputs = (event) => {
        setErrors({
            titleError: "",
        });
        const { name, value } = event.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Seperate function to do same as above due to the nested array of subtasks
    const handleSubtaskInputs = (event, index) => {
        const { value } = event.target;
        const newSubtasks = [...formData.subtasks];

        if (newSubtasks[index] === undefined) {
            newSubtasks[index] = { title: value, completed: false };
        } else {
            newSubtasks[index] = { ...formData.subtasks[index], title: value };
        }

        setFormData({ ...formData, subtasks: newSubtasks });
    };

    // ========================================================================

    // Subtasks

    // Handle adding a new subtask
    const newSubTask = (e) => {
        e.preventDefault();
        formData.subtasks.push({ title: "", completed: false });
        dispatchTask({ type: `UPDATE_NEWSUBTASKS`, payload: addSubtaskArray });
    };

    // Handle deleting an added subtask
    const deleteAddedSubTask = (e) => {
        const index = e.currentTarget.id;
        const subtasks = [...formData.subtasks];
        subtasks.splice(index, 1);

        setFormData({
            ...formData,
            subtasks: subtasks,
        });
        console.log(formData);

        // Triggers re-render
        dispatchTask({ type: `UPDATE_TASKS`, payload: !updateTasks });
    };

    // ========================================================================

    // Form handling: Submit/Close

    // Handle click cancel btn
    const handleCancelAdd = (e) => {
        e.preventDefault();
        // Resets the add subtask input/array to empty if modal closed without editing
        dispatchTask({ type: `SET_NEWSUBTASKS`, payload: [] });
        dispatchTask({ type: `ADDTASK_OPEN`, payload: !addTaskOpen });
    };

    // Submit Form
    const submitTask = async (e) => {
        e.preventDefault();

        // Conditionally removes the subtasks if empty to prevent errors
        let updatedFormData;
        if (formData.subtasks[0].title === "") {
            updatedFormData = { ...formData };
            delete updatedFormData.subtasks;
            setFormData(updatedFormData);
        }
        const newTask = updatedFormData ? updatedFormData : formData;

        try {
            const response = await fetch(`${apiURL}/tasks/create-task`, {
                method: `POST`,
                headers: {
                    "Content-type": "application/json",
                },
                // To be sent in the body to the backend
                body: JSON.stringify({
                    user_ID: formData.user_ID,
                    task: newTask,
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
                handleCancelAdd(e);
            }
        } catch (error) {
            console.log(error);
        }

        // Reset formData
        setFormData({
            user_ID: selectedTask.user_ID,
            taskBoard: selectedTask.taskBoard,
            taskTitle: selectedTask.taskTitle,
            taskDesc: selectedTask.taskDesc,
            subtasks: selectedTask.subtasks,
            taskStatus: selectedTask.taskStatus,
        });

        // Trigger render
        dispatchTask({ type: `UPDATE_TASKS`, payload: !updateTasks });
    };

    // ========================================================================

    const addTaskBoardToFormData = (e) => {
        const optionTaskBoard = e.currentTarget.value;

        // Set value to formData
        setFormData({
            ...formData,
            taskBoard: optionTaskBoard,
        });
    };

    // ========================================================================

    return (
        <>
            {addTaskOpen && taskBoards.length > 0 && (
                <>
                    <div className="overlay flex">
                        {/* Edit Form */}
                        <form className="add-task-form border-radius-s even-spacing-m">
                            <h3 className="h-l form-title">Add Task</h3>

                            {/* Close Button*/}
                            <button
                                className="close-form-btn flex align-center"
                                type="button"
                                onClick={handleCancelAdd}
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

                            {/* TaskBoard Form Group */}
                            {currentUrl !== "/tasks" ? (
                                <div className="form-group flex flex-col even-spacing-xs">
                                    <label className="form-label h-s" htmlFor="taskBoard">
                                        TaskBoard
                                    </label>
                                    <select
                                        className="input body-l border-radius-s"
                                        type="text"
                                        name="taskBoard"
                                        value={formData.taskBoard}
                                        onChange={(e) => {
                                            addTaskBoardToFormData(e);
                                            handleInputs(e);
                                        }}
                                        required
                                    >
                                        {allTaskBoardTitles &&
                                            allTaskBoardTitles.map((taskBoard, index) => {
                                                return (
                                                    <option key={index} value={taskBoard}>
                                                        {taskBoard}
                                                    </option>
                                                );
                                            })}
                                    </select>
                                </div>
                            ) : (
                                <div className="form-group flex flex-col even-spacing-xs">
                                    <label className="form-label h-s" htmlFor="taskBoard">
                                        Current TaskBoard
                                    </label>
                                    <div className="add-input taskboard body-l border-radius-s">
                                        {formData.taskBoard}
                                    </div>
                                </div>
                            )}

                            {/* Title Form Group */}
                            <div className="form-group flex flex-col even-spacing-xs">
                                <label className="form-label h-s" htmlFor="taskTitle">
                                    Title
                                </label>
                                <input
                                    className="add-input body-l border-radius-s"
                                    type="text"
                                    name="taskTitle"
                                    placeholder="Walk the dog"
                                    value={formData.taskTitle}
                                    autoComplete="name"
                                    onChange={handleInputs}
                                    minLength={1}
                                    maxLength={59}
                                    required
                                />
                                {/* Displays title errors */}
                                {errors.titleError && errors.titleError !== "" && (
                                    <p className="error text-error">
                                        {errors.titleError}
                                    </p>
                                )}
                            </div>

                            {/* Description Form Group */}
                            <div className="form-group flex flex-col even-spacing-xs">
                                <label className="form-label h-s" htmlFor="description">
                                    Description
                                </label>
                                <textarea
                                    className="add-textarea body-l border-radius-s"
                                    type="text"
                                    name="taskDesc"
                                    placeholder="Walk to the park and play lots of fetch!"
                                    value={formData.taskDesc}
                                    autoComplete="name"
                                    onChange={handleInputs}
                                    required
                                />
                            </div>

                            {/* Subtasks Form Group */}
                            <div className="form-group flex flex-col even-spacing-s">
                                <label className="form-label h-s" htmlFor="subtask">
                                    Subtasks
                                </label>

                                <ul className="even-spacing-xs">
                                    {/* If there are subtasks then map the subtasks */}
                                    {formData.subtasks &&
                                        formData.subtasks.map((subtask, index) => {
                                            return (
                                                <li
                                                    key={index}
                                                    className="subtask-wrapper flex align-center"
                                                >
                                                    <input
                                                        className="add-input body-l border-radius-s"
                                                        type="text"
                                                        name="subtask"
                                                        placeholder="Add a subtask"
                                                        value={
                                                            formData.subtasks[index].title
                                                        }
                                                        autoComplete="name"
                                                        onChange={(event) =>
                                                            handleSubtaskInputs(
                                                                event,
                                                                index
                                                            )
                                                        }
                                                        required
                                                    />
                                                    <button
                                                        id={index}
                                                        type="button"
                                                        className="delete-subtask flex align-center"
                                                        onClick={deleteAddedSubTask}
                                                    >
                                                        <svg
                                                            className="delete-subtask"
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
                                                </li>
                                            );
                                        })}
                                </ul>

                                <button
                                    type="button"
                                    className="form-btn form-btn-secondary bg-secondary h-s text-primary letter-spacing-s border-radius-l"
                                    onClick={newSubTask}
                                >
                                    Add Subtask
                                </button>
                            </div>

                            {/* Task Status Form Group */}
                            <div className="form-group flex flex-col even-spacing-xs">
                                <label className="form-label h-s" htmlFor="taskStatus">
                                    Status
                                </label>
                                <select
                                    className="input body-l border-radius-s"
                                    type="text"
                                    name="taskStatus"
                                    value={formData.taskStatus}
                                    onChange={handleInputs}
                                    required
                                >
                                    <option value="todo">Todo</option>
                                    <option value="inProgress">In Progress</option>
                                </select>
                            </div>

                            {/* Edit / Delete Form Group */}
                            <div className="flex flex-col even-spacing-s">
                                <button
                                    type="submit"
                                    className="form-btn form-btn-primary bg-primary h-s text-white letter-spacing-s border-radius-l"
                                    onClick={submitTask}
                                >
                                    Add Task
                                </button>
                            </div>
                        </form>
                    </div>
                </>
            )}
        </>
    );
}

export default AddTask;
