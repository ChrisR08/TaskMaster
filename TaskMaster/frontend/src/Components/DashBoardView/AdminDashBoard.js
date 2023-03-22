// ADMIN DASHBOARD
import React, { useState, useEffect } from "react";

// Express API URL
import apiURL from "../../apiConfig";

// Import the date library to format dates for better UX
import { format } from "date-fns";

// Components
import DeleteUserModal from "./DeleteUserModal";

// State/Context
import { useTasksContext } from "../../hooks/useTasksContext";
import { useUserContext } from "../../hooks/useUserContext";

// CSS
import "./DashBoard.css";

const AdminDashBoard = () => {
    const { deleteUserModalOpen, dispatchUser } = useUserContext();
    const { updateTasks } = useTasksContext();

    // Define state variables for user data
    const [users, setUsers] = useState([]);

    // ========================================================================

    // Define function to fetch user data
    const fetchUsers = async () => {
        try {
            const response = await fetch(`${apiURL}/admin/get-users`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            console.log(data);
            setUsers(data);
        } catch (error) {
            console.log(error);
        }
    };

    // Call fetchUsers when component mounts
    useEffect(() => {
        fetchUsers();
    }, [updateTasks]);

    // ========================================================================

    // Define function to update admin status
    const updateAdminStatus = async (userId, isAdmin) => {
        try {
            const response = await fetch(`${apiURL}/admin/update-admin-status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: userId,
                    isAdmin: isAdmin,
                }),
            });
            const data = await response.json();
            // Update state variable to reflect new admin status for user
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user._id === userId ? { ...user, admin: isAdmin } : user
                )
            );
        } catch (error) {
            console.log(error);
        }
    };

    // ========================================================================

    // Opens the delete user confimation modal
    const openDeleteUser = (user) => {
        dispatchUser({ type: `SET_DELETE_USER`, payload: user });
        dispatchUser({ type: `SET_USER_DELETE_OPEN`, payload: true });
    };

    // ========================================================================

    return (
        <div className="admin-dashboard-wrapper flex flex-col even-spacing-s">
            <h2 className="h-l">Admin Dashboard:</h2>
            <ul className="tasks-ul dashboard even-spacing-s">
                {users &&
                    users.map((user, index) => (
                        <li
                            key={user._id}
                            className="dashboard-li flex flex-col even-spacing-xs border-radius-s"
                        >
                            <p className="body-l">
                                User Name: <span>{user.userName}</span>
                            </p>
                            <p className="body-l">
                                Email: <span>{user.email}</span>
                            </p>

                            <p className="body-l">
                                Status: <span>{user.admin ? "Admin" : "Subscriber"}</span>
                            </p>

                            <p className="body-l">
                                Created: {/* Formats the date for better UX */}
                                <span>
                                    {format(new Date(user.createdAt), "dd/MM/yyyy")}
                                </span>
                            </p>

                            <label className="body-l">
                                Make User Admin:
                                {/* Can set the user admin status */}
                                <input
                                    type="checkbox"
                                    checked={user.admin}
                                    onChange={() =>
                                        updateAdminStatus(user._id, !user.admin)
                                    }
                                />
                            </label>

                            <button
                                type="button"
                                className="delete-btn admin bg-error h-s text-white letter-spacing-s border-radius-l"
                                onClick={(e) => {
                                    openDeleteUser(user);
                                }}
                            >
                                Delete User
                            </button>
                        </li>
                    ))}
            </ul>
            {deleteUserModalOpen && <DeleteUserModal />}
        </div>
    );
};

export default AdminDashBoard;
