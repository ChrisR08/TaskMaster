// USER DASHBOARD
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Express API URL
import apiURL from "../../apiConfig";

// Import the date library to format dates for better UX
import { format } from "date-fns";

// State/Context
import { useUserContext } from "../../hooks/useUserContext";
import { useTasksContext } from "../../hooks/useTasksContext";
import { useNavContext } from "../../hooks/useNavContext";

import DeleteBoard from "../globalComponents/DeleteBoard";

import "./DashBoard.css";

const UserDashBoard = () => {
    // Creating an instance of useNavigate
    const navigate = useNavigate();

    const { userId } = useUserContext();
    const { taskBoards, allUserTasks, updateTasks, updateTaskBoards, dispatchTask } =
        useTasksContext();

    const { addBoardOpen, deleteBoardOpen, dispatchNav } = useNavContext();

    // ========================================================================

    // Define state variables for the three arrays
    const [todoTasksArray, setTodoTasksArray] = useState([]);
    const [inProgressTasksArray, setInProgressTasksArray] = useState([]);
    const [doneTasksArray, setDoneTasksArray] = useState([]);

    // ========================================================================

    // ========================================================================

    // Get All User Tasks
    const getAllUserTasks = async () => {
        if (userId) {
            try {
                const response = await fetch(`${apiURL}/tasks/get-all-tasks`, {
                    method: `POST`,
                    headers: {
                        "Content-type": "application/json",
                    },
                    // To be sent in the body to the backend
                    body: JSON.stringify({
                        user_ID: userId,
                    }),
                });
                const data = await response.json();

                if (data.allUserTasks) {
                    // Sets all the users taks to state
                    const allUserTasks = data.allUserTasks;
                    dispatchTask({ type: `SET_ALL_USER_TASKS`, payload: allUserTasks });
                }
            } catch (error) {
                console.log(error);
            }
        } else {
            console.log(`No userId. Could not attempt get-all-tasks`);
        }
    };

    useEffect(() => {
        getAllUserTasks();
        // eslint-disable-next-line
    }, [userId, updateTasks, updateTaskBoards]);

    // ========================================================================

    const sortTasks = () => {
        // Initialize arrays with state variable setters
        setTodoTasksArray([]);
        setInProgressTasksArray([]);
        setDoneTasksArray([]);

        // If there are tasks then map through them and add them to their respective array
        if (allUserTasks && allUserTasks.length > 0) {
            allUserTasks.forEach((task) => {
                if (task.taskStatus === "todo") {
                    setTodoTasksArray((prevArray) => [...prevArray, task]);
                } else if (task.taskStatus === "inProgress") {
                    setInProgressTasksArray((prevArray) => [...prevArray, task]);
                } else if (task.taskStatus === "done") {
                    setDoneTasksArray((prevArray) => [...prevArray, task]);
                }
            });
        }
    };

    // Empty dependancy to only run once on mount
    useEffect(() => {
        sortTasks();
        // eslint-disable-next-line
    }, [allUserTasks, updateTasks, updateTaskBoards]);

    // ========================================================================

    // Handle button click
    const goToBoard = (title) => {
        localStorage.setItem(`taskBoardTitle`, title);
        dispatchTask({ type: `SET_TASKBOARDTITLE`, payload: title });
        navigate(`/tasks`);
    };

    // Open the add board modal
    const openAddBoard = () => {
        dispatchNav({ type: `ADDBOARD_OPEN`, payload: !addBoardOpen });
    };

    // ========================================================================

    const openDeleteModal = (title) => {
        localStorage.setItem(`taskBoardTitle`, title);
        dispatchTask({ type: `SET_TASKBOARDTITLE`, payload: title });
        dispatchNav({ type: `DELETEBOARD_OPEN`, payload: !deleteBoardOpen });
    };

    // ========================================================================

    return (
        <div className="user-dashboard-wrapper flex flex-col even-spacing-m">
            {taskBoards && taskBoards.length > 0 ? (
                <h2 className="h-l">Your TaskBoards:</h2>
            ) : (
                <>
                    <div className="dashboard-li flex flex-col even-spacing-s border-radius-s">
                        <p className="h-l">Add a TaskBoard to get started...</p>
                        <button
                            className="add-task-btn in-board flex center-xy border-radius-m"
                            onClick={openAddBoard}
                        >
                            <img
                                className="icon-plus"
                                src="/icons/icon-add-task-mobile.svg"
                                alt="Add task button"
                            />{" "}
                            <h4 className="task-title h-m">Add TaskBoard</h4>
                        </button>
                    </div>
                </>
            )}

            <ul className="tasks-ul dashboard even-spacing-m">
                {taskBoards &&
                    taskBoards.map((taskBoard, index) => (
                        <li
                            key={taskBoard._id}
                            className="dashboard-li flex flex-col even-spacing-xs border-radius-s"
                        >
                            <h4 className="h-m">{taskBoard.taskBoard}</h4>

                            <h5 className="h-m">Tasks:</h5>

                            <ul className="task-status-ul">
                                <li className="body-l task-status-title">
                                    Todo:{" "}
                                    {/* Filters to show specific boards task lengths */}
                                    <span>
                                        {
                                            todoTasksArray.filter(
                                                (task) =>
                                                    task.taskBoard === taskBoard.taskBoard
                                            ).length
                                        }
                                    </span>
                                </li>

                                <li className="body-l task-status-title">
                                    In Progress:{" "}
                                    <span>
                                        {
                                            inProgressTasksArray.filter(
                                                (task) =>
                                                    task.taskBoard === taskBoard.taskBoard
                                            ).length
                                        }
                                    </span>
                                </li>

                                <li className="body-l task-status-title">
                                    Done:{" "}
                                    <span>
                                        {
                                            doneTasksArray.filter(
                                                (task) =>
                                                    task.taskBoard === taskBoard.taskBoard
                                            ).length
                                        }
                                    </span>
                                </li>
                            </ul>

                            <p className="body-l">
                                Created: {/* Formats the date for better UX */}
                                <span>
                                    {format(new Date(taskBoard.createdAt), "dd/MM/yyyy")}
                                </span>
                            </p>

                            {/* Butttons */}
                            <div className="flex flex-col even-spacing-s">
                                {/* Directs user to the board */}
                                <button
                                    type="button"
                                    className="bg-primary form-btn h-s text-white letter-spacing-s border-radius-l"
                                    onClick={() => {
                                        goToBoard(taskBoard.taskBoard);
                                    }}
                                >
                                    Go To Board
                                </button>

                                {/* Open Delete Modal Buttton */}
                                <button
                                    type="button"
                                    className="form-btn form-btn-cancel bg-error h-s text-white letter-spacing-s border-radius-l"
                                    onClick={() => {
                                        openDeleteModal(taskBoard.taskBoard);
                                    }}
                                >
                                    Delete Board
                                </button>
                            </div>
                        </li>
                    ))}
            </ul>
            {deleteBoardOpen && <DeleteBoard />}
        </div>
    );
};

export default UserDashBoard;
