// TASK MODAL
import React from "react";

// Express API URL
import apiURL from "../../apiConfig";

// Global State
import { useTasksContext } from "../../hooks/useTasksContext";

// CSS
import "./EditTask.css";

function TaskModal() {
    // Making the Contexts avaliable
    const { taskModalOpen, selectedTaskId, selectedTask, updateTasks, dispatchTask } =
        useTasksContext();

    // // ========================================================================

    // Closes Task Modal & Opens Edit Modal
    const openEditTask = () => {
        // Close Task modal
        dispatchTask({ type: `TASKMODAL_OPEN`, payload: false });
        // Open delete Task modal
        dispatchTask({ type: `EDITTASK_OPEN`, payload: true });
    };

    // ========================================================================

    // Modal: Click Events

    // Handle click cancel btn
    const handleClose = (e) => {
        e.preventDefault();
        dispatchTask({ type: `TASKMODAL_OPEN`, payload: !taskModalOpen });
    };

    // Handle marking a subtask as complete
    const markCompleted = async (e) => {
        e.preventDefault();
        // Finding the target object in the array of subtasks
        const subtask = selectedTask.subtasks.find(
            (task) => task._id === e.currentTarget.id
        );
        // Finding the target's index in the array of subtasks
        const subtaskIndex = selectedTask.subtasks.findIndex(
            (subtask) => subtask._id === e.currentTarget.id
        );

        let updatedTask;
        // If there is a subtask found then alternate the boolean value at completed
        if (subtask) {
            subtask.completed = !subtask.completed;
            updatedTask = { ...selectedTask };
        }

        // If the values exist then attempt the PUT request
        if (updatedTask && selectedTaskId) {
            try {
                const response = await fetch(`${apiURL}/tasks/edit-task`, {
                    method: `PUT`,
                    headers: {
                        "Content-type": "application/json",
                    },
                    // To be sent in the body to the backend
                    body: JSON.stringify({
                        taskId: selectedTaskId,
                        editedTask: updatedTask,
                    }),
                });
                const data = await response.json();

                // Updates the selected task and triggers render
                dispatchTask({ type: `SET_SELECTEDTASK`, payload: updatedTask });
                dispatchTask({ type: `UPDATE_TASKS`, payload: !updateTasks });
            } catch (error) {
                console.log(error);
            }
        }
    };

    // ========================================================================

    // Mark the task as complete in the UI and update the db
    const markTaskComplete = async () => {
        const task = selectedTask;
        task.taskStatus = "done";

        // If the values exist then attempt the PUT request
        if (task && selectedTaskId) {
            try {
                const response = await fetch(`${apiURL}/tasks/edit-task`, {
                    method: `PUT`,
                    headers: {
                        "Content-type": "application/json",
                    },
                    // To be sent in the body to the backend
                    body: JSON.stringify({
                        taskId: selectedTaskId,
                        editedTask: task,
                    }),
                });
                const data = await response.json();

                // Sets the returned currentTaskBoard arrays to state
                dispatchTask({ type: `UPDATE_TASKS`, payload: !updateTasks });
            } catch (error) {
                console.log(error);
            }
        }
    };

    // ========================================================================

    const openDeleteModal = () => {
        // Close edit Task modal
        dispatchTask({ type: `TASKMODAL_OPEN`, payload: false });
        // Open delete Task modal
        dispatchTask({ type: `DELETETASK_OPEN`, payload: true });
    };

    // ========================================================================

    return (
        <>
            {taskModalOpen && (
                <>
                    <div className="overlay flex">
                        <div className="edit-task-form border-radius-s even-spacing-m">
                            <h3 className="h-l form-title">{selectedTask.taskTitle}</h3>

                            {/* Close Button*/}
                            <button
                                className="close-form-btn flex align-center"
                                type="button"
                                onClick={handleClose}
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

                            {/* Description */}
                            <p className="body-l text-light-grey border-radius-s">
                                {selectedTask.taskDesc}
                            </p>

                            {/* Subtasks Group */}
                            <div className="form-group flex flex-col even-spacing-s">
                                <h4 className="form-label h-s">
                                    Subtasks
                                    <span className="body-s text-light-grey">{`: ${
                                        selectedTask && selectedTask.subtasks
                                            ? selectedTask.subtasks.filter(
                                                  (subtask) =>
                                                      subtask && subtask.completed
                                              ).length
                                            : 0
                                    } of ${
                                        selectedTask && selectedTask.subtasks
                                            ? selectedTask.subtasks.length
                                            : 0
                                    } completed`}</span>
                                </h4>

                                <ul className="even-spacing-xs">
                                    {/* If there are subtasks then map the subtasks */}
                                    {selectedTask.subtasks &&
                                        selectedTask.subtasks.map((subtask, index) => {
                                            return (
                                                <li
                                                    key={index}
                                                    className="subtask-wrapper flex align-center"
                                                >
                                                    <div className="subtasks-inner-wrapper body-l align-center flex border-radius-s">
                                                        <button
                                                            id={subtask._id}
                                                            type="button"
                                                            className="check-subtask-btn flex center-xy"
                                                            data-checked={
                                                                selectedTask.subtasks[
                                                                    index
                                                                ].completed
                                                            }
                                                            onClick={markCompleted}
                                                        >
                                                            <svg className="check-subtask-icon">
                                                                <path
                                                                    strokeWidth="2"
                                                                    fill="none"
                                                                    d="m1.276 3.066 2.756 2.756 5-5"
                                                                />
                                                            </svg>
                                                        </button>
                                                        <p>
                                                            {
                                                                selectedTask.subtasks[
                                                                    index
                                                                ].title
                                                            }
                                                        </p>
                                                    </div>
                                                </li>
                                            );
                                        })}
                                </ul>
                            </div>

                            {/* Task Status  */}
                            <div className="form-group flex flex-col even-spacing-xs">
                                <h4 className="form-label h-s" htmlFor="taskStatus">
                                    Status
                                </h4>
                                <div className="input body-l border-radius-s">
                                    {selectedTask.taskStatus}
                                </div>
                                {/* Mark Completed  */}
                                {selectedTask.taskStatus === "done" ? null : (
                                    <div className="subtasks-inner-wrapper body-l align-center flex border-radius-s">
                                        <button
                                            id="test"
                                            type="button"
                                            className="check-subtask-btn flex center-xy"
                                            data-checked={
                                                selectedTask.taskStatus === "done"
                                            }
                                            onClick={markTaskComplete}
                                        >
                                            <svg className="check-subtask-icon">
                                                <path
                                                    strokeWidth="2"
                                                    fill="none"
                                                    d="m1.276 3.066 2.756 2.756 5-5"
                                                />
                                            </svg>
                                        </button>
                                        <p className="task-completed">Task Completed</p>
                                    </div>
                                )}
                            </div>

                            {/* Edit Task Buttton */}
                            <div className="flex flex-col even-spacing-s">
                                <button
                                    type="submit"
                                    className="form-btn form-btn-primary bg-primary h-s text-white letter-spacing-s border-radius-l"
                                    onClick={openEditTask}
                                >
                                    Edit Task
                                </button>

                                {/* Open Delete Modal Buttton */}
                                <button
                                    type="button"
                                    className="form-btn form-btn-cancel bg-error h-s text-white letter-spacing-s border-radius-l"
                                    onClick={openDeleteModal}
                                >
                                    Delete Task
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

export default TaskModal;
