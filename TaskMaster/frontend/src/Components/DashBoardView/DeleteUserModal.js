// DELETE USER MODAL

// Express API URL
import apiURL from "../../apiConfig";

// Global State
import { useTasksContext } from "../../hooks/useTasksContext";
import { useUserContext } from "../../hooks/useUserContext";

// CSS
import "../TaskView/Delete.css";

function DeleteUserModal() {
    // Making the Contexts avaliable
    const { updateTasks, dispatchTask } = useTasksContext();

    const { deleteUserModalOpen, deleteUser, dispatchUser } = useUserContext();

    // Handle click cancel btn
    const handleCancelDelete = (e) => {
        e.preventDefault();
        dispatchUser({ type: `SET_USER_DELETE_OPEN`, payload: false });
    };

    // ========================================================================

    // Handle submitting delete
    // // Deletes the user and their tasks/taskBoards from the db
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${apiURL}/admin/delete-user`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                // To be sent in the body to the backend
                body: JSON.stringify({
                    userId: deleteUser._id,
                }),
            });
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.log(error);
            alert("Error deleting user. Please try again later.");
        }

        // Triggers render to update tasks
        dispatchTask({ type: `UPDATE_TASKS`, payload: !updateTasks });

        // Closes the modal
        handleCancelDelete(e);
    };

    // ========================================================================

    return (
        <>
            {deleteUserModalOpen && (
                <div className="overlay flex">
                    <div className="delete-card flex flex-col even-spacing-s border-radius-m">
                        <h3 className="h-l text-error">Delete user?</h3>
                        <p className="delete-card-p body-l">
                            Are you sure you want to delete:{" "}
                            {/* Span dynamically displays the task title to user */}
                            <span className="text-form">{deleteUser.userName}</span> and
                            their tasks?
                        </p>
                        <p className="delete-card-p body-l">
                            This action cannot be reversed!
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

export default DeleteUserModal;
