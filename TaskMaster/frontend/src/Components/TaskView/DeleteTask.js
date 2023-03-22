// DELETE TASK MODAL

// Express API URL
import apiURL from "../../apiConfig";

// Global State
import { useTasksContext } from "../../hooks/useTasksContext";

// CSS
import "./Delete.css";

function DeleteTask() {
    // Making the Contexts avaliable
    const { selectedTaskId, selectedTask, deleteTaskOpen, updateTasks, dispatchTask } =
        useTasksContext();

    // Handle click cancel btn
    const handleCancelDelete = (e) => {
        e.preventDefault();
        dispatchTask({ type: `DELETETASK_OPEN`, payload: false });
    };

    // Getting the values for use in handleSubmit
    const userId = localStorage.getItem(`userId`);
    const taskId = selectedTaskId;

    // ========================================================================

    // Handle submitting delete
    // DELETE request and state update to trigger render
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (taskId && userId) {
            try {
                const response = await fetch(`${apiURL}/tasks/delete-task`, {
                    method: `DELETE`,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ taskId, userId }),
                });
                const data = await response.json();
                console.log(data);
            } catch (error) {
                console.log(error);
            }
        }

        // Triggers render to update tasks
        dispatchTask({ type: `UPDATE_TASKS`, payload: !updateTasks });
        // Closes the modal
        handleCancelDelete(e);
    };

    return (
        <>
            {deleteTaskOpen && (
                <div className="overlay flex">
                    <div className="delete-card flex flex-col even-spacing-s border-radius-m">
                        <h3 className="h-l text-error">Delete this task?</h3>
                        <p className="delete-card-p body-l">
                            Are you sure you want to delete the{" "}
                            {/* Span dynamically displays the task title to user */}
                            <span className="text-form">
                                {selectedTask.taskTitle}
                            </span>{" "}
                            task and its subtasks? This action cannot be reversed!
                        </p>
                        <div className="flex flex-col even-spacing-s">
                            <button
                                type="button"
                                className="delete-btn bg-error h-s text-white letter-spacing-s border-radius-l"
                                onClick={handleSubmit}
                            >
                                Delete
                            </button>
                            <button
                                type="button"
                                className="cancel-btn bg-secondary h-s text-primary letter-spacing-s border-radius-l"
                                onClick={handleCancelDelete}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default DeleteTask;
