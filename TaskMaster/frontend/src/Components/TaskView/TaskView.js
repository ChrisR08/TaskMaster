// TASK VIEW
import React, { useState, useEffect, useRef } from "react";

// Express API URL
import apiURL from "../../apiConfig";

// Importing the states
import { useTasksContext } from "../../hooks/useTasksContext";

// CSS
import "./TaskView.css";

function TaskView() {
    // Making taskContext available
    const {
        todoTasks,
        inProgressTasks,
        doneTasks,
        currentBoardTasks,
        selectedTask,
        taskBoardTitle,
        addTaskOpen,
        updateTasks,
        dispatchTask,
    } = useTasksContext();

    // ========================================================================

    // Fetches the user id from sessionStorage
    const userId = localStorage.getItem(`userId`);

    // Fetches the tasks from the db for the current taskBoard and adds them to sessionStorage
    const fetchTasks = async (taskBoardTitle, user_ID) => {
        if (taskBoardTitle && user_ID) {
            try {
                const response = await fetch(`${apiURL}/tasks/get-tasks`, {
                    method: `POST`,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    // To be sent in the body to the backend
                    body: JSON.stringify({
                        taskBoard: taskBoardTitle,
                        user_ID: user_ID,
                    }),
                });

                const data = await response.json();

                if (!data.userTasks) {
                    sessionStorage.setItem(`currentBoardTasks`, JSON.stringify([]));

                    // Sets tasks to global state
                    dispatchTask({ type: `SET_CURRENT_TASKS`, payload: null });
                }

                if (data.userTasks) {
                    sessionStorage.setItem(
                        `currentBoardTasks`,
                        JSON.stringify(data.userTasks)
                    );

                    // Sets tasks to global state
                    dispatchTask({ type: `SET_CURRENT_TASKS`, payload: data.userTasks });

                    // Calls the sort tasks function passing the fetched tasks as an argument
                    sortTasks(data.userTasks);
                }
            } catch (error) {
                console.log(error);
            }
        }
    };

    useEffect(() => {
        fetchTasks(taskBoardTitle, userId);
    }, [taskBoardTitle, updateTasks, selectedTask]);

    // ========================================================================

    // These blocks get the current tasks from storage, catergorises and makes them avaliable

    const sortTasks = (currentTasks) => {
        // Initialise arrays
        let todoTasksArray = [];
        let inProgressTasksArray = [];
        let doneTasksArray = [];

        // If there are tasks then map through them and add them to their respective array
        if (currentTasks && currentTasks.length > 0) {
            currentTasks.forEach((task) => {
                if (task.taskStatus === "todo") {
                    todoTasksArray.push(task);
                } else if (task.taskStatus === "inProgress") {
                    inProgressTasksArray.push(task);
                } else if (task.taskStatus === "done") {
                    doneTasksArray.push(task);
                }
            });
        }

        // Set task arrays in sessionStorage
        dispatchTask({ type: `SET_TODO_TASKS`, payload: todoTasksArray });
        dispatchTask({ type: `SET_INPROGRESS_TASKS`, payload: inProgressTasksArray });
        dispatchTask({ type: `SET_DONE_TASKS`, payload: doneTasksArray });
    };

    // ========================================================================

    // This section of code facilitates the pagination dots
    // Initialising state with column one
    const [activeColumn, setActiveColumn] = useState("column1");
    // Initialising refs
    const ref = useRef(null);
    const ref1 = useRef(null);
    const ref2 = useRef(null);
    const ref3 = useRef(null);

    // useEffect fires the IntersectionObserver
    useEffect(() => {
        const observeBoards = () => {
            if (taskBoardTitle) {
                const observer = new IntersectionObserver(
                    ([entry]) => {
                        // Sets threshold at 50% of element
                        if (entry.intersectionRatio >= 0.5) {
                            setActiveColumn(entry.target.id);
                        }
                    },
                    { threshold: 0.5 }
                );

                // Setting the observers
                observer.observe(ref1.current);
                observer.observe(ref2.current);
                observer.observe(ref3.current);

                // Disconnect when component unmounts
                return () => {
                    observer.disconnect();
                };
            }
        };
        observeBoards();
    }, [taskBoardTitle, updateTasks]);

    // ========================================================================

    // Retrieves the selected task and adds it to storage/state
    const getSelectedTask = (taskId) => {
        // Find the task with the current taskId
        const selectedTask = currentBoardTasks.find((task) => task._id === taskId);

        sessionStorage.setItem(`selectedTask`, JSON.stringify(selectedTask));
        dispatchTask({ type: `SET_SELECTEDTASK`, payload: selectedTask });
    };

    // Gets the click task ID and sets to state
    const viewTask = async (e) => {
        const taskId = e.target.id;

        dispatchTask({ type: `SET_SELECTEDTASKID`, payload: taskId });

        getSelectedTask(taskId);

        // Open TaskModal
        dispatchTask({ type: `TASKMODAL_OPEN`, payload: true });
    };

    // ========================================================================

    const toggleAddTask = () => {
        const userId = localStorage.getItem(`userId`);
        const taskBoard = localStorage.getItem(`taskBoardTitle`);

        if (!addTaskOpen) {
            dispatchTask({
                type: `SET_SELECTEDTASK`,
                payload: {
                    user_ID: userId,
                    taskBoard: taskBoard,
                    taskTitle: "",
                    taskDesc: "",
                    subtasks: [{ title: "", completed: false }],
                    taskStatus: "todo",
                },
            });
            dispatchTask({ type: `ADDTASK_OPEN`, payload: true });
        } else if (addTaskOpen) {
            dispatchTask({ type: `ADDTASK_OPEN`, payload: false });
        }
    };

    // ========================================================================

    return (
        <>
            {taskBoardTitle && (
                <>
                    <div className="taskview-wrapper flex flex-col even-spacing-m">
                        <h2 className="h-l text-light-grey task-board-title">
                            {taskBoardTitle}
                        </h2>
                        <div className="task-board-wrapper flex" ref={ref}>
                            <div className="task-dots-container">
                                <span
                                    className={`task-icon todo-icon round ${
                                        activeColumn === "column1"
                                            ? "active"
                                            : "not-active"
                                    }`}
                                />
                                <span
                                    className={`task-icon in-progress-icon round ${
                                        activeColumn === "column2"
                                            ? "active"
                                            : "not-active"
                                    }`}
                                />
                                <span
                                    className={`task-icon done-icon round ${
                                        activeColumn === "column3"
                                            ? "active"
                                            : "not-active"
                                    }`}
                                />
                            </div>
                            {/* TODO Column */}
                            <div
                                className="task-column flex flex-col even-spacing-s"
                                ref={ref1}
                                id="column1"
                            >
                                <div className="task-column-title-wrapper flex align-center">
                                    <div className="task-icon todo-icon round"></div>
                                    <h3 className="h-m text-light-grey uppercase letter-spacing-m">
                                        Todo:{" "}
                                        {currentBoardTasks
                                            ? todoTasks && todoTasks.length
                                            : 0}
                                    </h3>
                                </div>
                                {/* TODO List */}
                                {currentBoardTasks ? (
                                    <ul className="tasks-ul even-spacing-s">
                                        {todoTasks && todoTasks.length > 0
                                            ? todoTasks.map((task, index) => {
                                                  return (
                                                      <li
                                                          key={index}
                                                          className="task-li flex flex-col even-spacing-xxs border-radius-s"
                                                      >
                                                          <h4 className="task-title">
                                                              {task.taskTitle}
                                                          </h4>
                                                          <p className="task-subtasks text-light-grey">
                                                              {task.subtasks.length}{" "}
                                                              {task.subtasks.length === 1
                                                                  ? `subtask`
                                                                  : `subtasks`}
                                                          </p>
                                                          <button
                                                              id={task._id}
                                                              type="button"
                                                              onClick={viewTask}
                                                              className="clickable-parent"
                                                          >
                                                              <img
                                                                  src="./icons/icon-vertical-ellipsis.svg"
                                                                  alt="Edit Task Button"
                                                                  className="edit-task-icon clickable-parent"
                                                              />
                                                          </button>
                                                      </li>
                                                  );
                                              })
                                            : ""}
                                    </ul>
                                ) : (
                                    <li className="task-li flex flex-col even-spacing-xxs center-xy border-radius-s">
                                        <button
                                            className="add-task-btn in-board flex center-xy border-radius-m"
                                            onClick={toggleAddTask}
                                        >
                                            <img
                                                className="icon-plus"
                                                src="/icons/icon-add-task-mobile.svg"
                                                alt="Add task button"
                                            />{" "}
                                            <h4 className="task-title uppercase">
                                                Add a Task
                                            </h4>
                                        </button>
                                    </li>
                                )}
                            </div>
                            {/* In Progress Column */}
                            <div
                                className="task-column flex flex-col even-spacing-s"
                                ref={ref2}
                                id="column2"
                            >
                                <div className="task-column-title-wrapper flex align-center">
                                    <div className="task-icon in-progress-icon round"></div>
                                    <h3 className="h-m text-light-grey uppercase letter-spacing-m">
                                        In Progress:{" "}
                                        {currentBoardTasks
                                            ? inProgressTasks && inProgressTasks.length
                                            : 0}
                                    </h3>
                                </div>
                                {/* In Progress List */}
                                {currentBoardTasks ? (
                                    <ul className="tasks-ul even-spacing-s">
                                        {inProgressTasks && inProgressTasks.length > 0
                                            ? inProgressTasks.map((task, index) => {
                                                  return (
                                                      <li
                                                          key={index}
                                                          className="task-li flex flex-col even-spacing-xxs border-radius-s"
                                                      >
                                                          <h4 className="task-title">
                                                              {task.taskTitle}
                                                          </h4>
                                                          <p className="task-subtasks text-light-grey">
                                                              {task.subtasks.length}{" "}
                                                              {task.subtasks.length === 1
                                                                  ? `subtask`
                                                                  : `subtasks`}
                                                          </p>
                                                          <button
                                                              id={task._id}
                                                              type="button"
                                                              onClick={viewTask}
                                                              className="clickable-parent"
                                                          >
                                                              <img
                                                                  src="./icons/icon-vertical-ellipsis.svg"
                                                                  alt="Edit Task Button"
                                                                  className="edit-task-icon clickable-parent"
                                                              />
                                                          </button>
                                                      </li>
                                                  );
                                              })
                                            : ""}
                                    </ul>
                                ) : null}
                            </div>
                            {/* DONE Column */}
                            <div
                                className="task-column flex flex-col even-spacing-s"
                                ref={ref3}
                                id="column3"
                            >
                                <div className="task-column-title-wrapper flex align-center">
                                    <div className="task-icon done-icon round"></div>
                                    <h3 className="h-m text-light-grey uppercase letter-spacing-m">
                                        Done:{" "}
                                        {currentBoardTasks
                                            ? doneTasks && doneTasks.length
                                            : 0}
                                    </h3>
                                </div>
                                {/* DONE List */}
                                {currentBoardTasks ? (
                                    <ul className="tasks-ul even-spacing-s">
                                        {doneTasks && doneTasks.length > 0
                                            ? doneTasks.map((task, index) => {
                                                  return (
                                                      <li
                                                          key={index}
                                                          className="task-li flex flex-col even-spacing-xxs border-radius-s"
                                                      >
                                                          <h4 className="task-title">
                                                              {task.taskTitle}
                                                          </h4>
                                                          <p className="task-subtasks text-light-grey">
                                                              {task.subtasks.length}{" "}
                                                              {task.subtasks.length === 1
                                                                  ? `subtask`
                                                                  : `subtasks`}
                                                          </p>
                                                          <button
                                                              id={task._id}
                                                              type="button"
                                                              onClick={viewTask}
                                                              className="clickable-parent"
                                                          >
                                                              <img
                                                                  src="./icons/icon-vertical-ellipsis.svg"
                                                                  alt="Edit Task Button"
                                                                  className="edit-task-icon clickable-parent"
                                                              />
                                                          </button>
                                                      </li>
                                                  );
                                              })
                                            : ""}
                                    </ul>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

export default TaskView;
