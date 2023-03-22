// EDIT TASK MODAL
import React, { useState } from "react";

// Express API URL
import apiURL from "../../apiConfig";

// Global State
import { useTasksContext } from "../../hooks/useTasksContext";

// CSS
import "./EditTask.css";

function EditTask() {
    // Making the Contexts avaliable
    const { editTaskOpen, selectedTaskId, selectedTask, updateTasks, dispatchTask } =
        useTasksContext();

    // ========================================================================

    const mappedSubtasks = selectedTask.subtasks.map((subtask, index) => {
        return { ...selectedTask.subtasks[index], title: subtask.title.trim() };
    });

    // Setting up the useState for the data from inputs in the login form
    const [formData, setFormData] = useState({
        taskTitle: selectedTask.taskTitle.trim(),
        description: selectedTask.taskDesc.trim(),
        subtasks: mappedSubtasks,
        taskStatus: selectedTask.taskStatus.trim(),
    });

    // Setting up the useState for error handling
    const [errors, setErrors] = useState({
        titleError: "",
        subtaskError: "",
    });

    // ========================================================================

    // Form handling: Inputs

    // Gets the name of the input and the value and sets them in formData
    const handleInputs = (event) => {
        setErrors({
            titleError: "",
        });
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
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
        const updatedSubtasks = [...formData.subtasks];
        updatedSubtasks.push({ title: "", completed: false });

        setFormData({
            ...formData,
            subtasks: updatedSubtasks,
        });
    };

    const deleteSubTask = (e) => {
        const index = e.currentTarget.id;

        const newSubtasks = [...formData.subtasks];

        newSubtasks.splice(index, 1);

        setFormData({
            ...formData,
            subtasks: newSubtasks,
        });

        // Sets the returned currentTaskBoard arrays to state
        dispatchTask({ type: `UPDATE_TASKS`, payload: !updateTasks });
    };

    // ========================================================================

    // Form handling: Submit/Close

    // Handle click cancel btn
    const handleCancelEdit = (e) => {
        e.preventDefault();
        // Resets the add subtask input/array to empty if modal closed without editing
        dispatchTask({ type: `UPDATE_NEWSUBTASKS`, payload: [] });
        dispatchTask({ type: `EDITTASK_OPEN`, payload: !editTaskOpen });
    };

    // Submit Form
    const submitEditTask = async (e) => {
        e.preventDefault();

        const emptySubtask = formData.subtasks.find(
            (subtask) => subtask.title.length === 0
        );

        if (emptySubtask === undefined) {
            // If the values exist then attempt the PUT request
            if (selectedTaskId && formData) {
                try {
                    const response = await fetch(`${apiURL}/tasks/edit-task`, {
                        method: `PUT`,
                        headers: {
                            "Content-type": "application/json",
                        },
                        // To be sent in the body to the backend
                        body: JSON.stringify({
                            taskId: selectedTaskId,
                            editedTask: formData,
                        }),
                    });
                    const data = await response.json();

                    // Handle errors & display to user
                    if (data.error) {
                        setErrors({
                            titleError: data.error,
                        });
                    } else if (!data.error) {
                        handleCancelEdit(e);
                    }

                    // Sets the returned currentTaskBoard arrays to state
                    dispatchTask({ type: `UPDATE_TASKS`, payload: !updateTasks });
                } catch (error) {
                    console.log(error);
                }
            }
        } else {
            setErrors({
                ...errors,
                subtaskError: `Subtask input cannot be empty. Delete it or add a title to the subtask.`,
            });
        }
    };

    // ========================================================================

    return (
        <>
            {editTaskOpen && (
                <>
                    <div className="overlay flex">
                        {/* Edit Form */}
                        <form className="edit-task-form border-radius-s even-spacing-m">
                            <h3 className="h-l form-title">Edit Task</h3>

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
                                <label className="form-label h-s" htmlFor="taskTitle">
                                    Title
                                </label>
                                <input
                                    className="edit-input body-l border-radius-s"
                                    type="text"
                                    name="taskTitle"
                                    placeholder={selectedTask.taskTitle}
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
                                    className="textarea body-l border-radius-s"
                                    type="text"
                                    name="description"
                                    placeholder={selectedTask.taskDesc}
                                    value={formData.description}
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
                                                        id={index}
                                                        className="edit-input body-l border-radius-s"
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
                                                        onClick={deleteSubTask}
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
                                {/* Displays title errors */}
                                {errors.subtaskError && errors.subtaskError !== "" && (
                                    <p className="error text-error">
                                        {errors.subtaskError}
                                    </p>
                                )}
                                <button
                                    type="button"
                                    className="form-btn form-btn-secondary bg-secondary h-s text-primary letter-spacing-s border-radius-l"
                                    onClick={newSubTask}
                                >
                                    Add New Subtask
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
                                    <option value="done">Done</option>
                                </select>
                            </div>

                            {/* Edit Task Button */}
                            <div className="flex flex-col even-spacing-s">
                                <button
                                    type="submit"
                                    className="form-btn form-btn-primary bg-primary h-s text-white letter-spacing-s border-radius-l"
                                    onClick={submitEditTask}
                                >
                                    Edit Task
                                </button>
                            </div>
                        </form>
                    </div>
                </>
            )}
        </>
    );
}

export default EditTask;
