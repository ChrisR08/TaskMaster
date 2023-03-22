// Context created for the user authentication and status
import { createContext, useReducer } from "react";

// Express API URL
import apiURL from "../apiConfig";

// Invoking an instance of createContext
export const TasksContext = createContext();

// Fetching the TaskBoards from the db
export const getAllTaskBoards = async (user_ID) => {
    const _id = user_ID;
    // Check the user_ID is not null before attempting fetch
    if (_id) {
        try {
            const response = await fetch(`${apiURL}/taskBoard/get-taskBoards`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_ID: _id,
                }),
            });
            const data = await response.json();
            if (data) {
                return data;
            }
        } catch (error) {
            console.log(error);
        }
    } else {
        throw Error`No userID passed to function.`;
    }
};

// Setting up the reducer function
export const tasksReducer = (state, action) => {
    switch (action.type) {
        case `SET_TODO_TASKS`:
            return {
                ...state,
                todoTasks: action.payload,
            };
        case `SET_INPROGRESS_TASKS`:
            return {
                ...state,
                inProgressTasks: action.payload,
            };
        case `SET_DONE_TASKS`:
            return {
                ...state,
                doneTasks: action.payload,
            };
        case `UPDATE_NEWSUBTASKS`:
            return {
                ...state,
                addSubtaskArray: action.payload,
            };
        case `SET_NEWSUBTASKS`:
            return {
                ...state,
                addNewSubtaskArray: action.payload,
            };
        case `SET_EDITEDTASK`:
            return {
                ...state,
                editedTask: action.payload,
            };
        case `SET_CURRENT_TASKS`:
            return {
                ...state,
                currentBoardTasks: action.payload,
            };
        case `SET_ALL_USER_TASKS`:
            return {
                ...state,
                allUserTasks: action.payload,
            };
        case `EDIT_TASK`:
            return {
                ...state,
                tasks: action.payload,
            };
        case `UPDATE_TASKBOARDS`:
            return {
                ...state,
                updateTaskBoards: action.payload,
            };
        case `SET_TASKBOARDTITLE`:
            return {
                ...state,
                taskBoardTitle: action.payload,
            };
        case `SET_ALLTASKBOARD_DATA`:
            return {
                ...state,
                taskBoards: action.payload,
            };
        case `SET_ALLTASKBOARDTITLES`:
            return {
                ...state,
                allTaskBoardTitles: action.payload,
            };
        case `SET_SELECTEDTASKID`:
            return {
                ...state,
                selectedTaskId: action.payload,
            };
        case `SET_SELECTEDTASK`:
            return {
                ...state,
                selectedTask: action.payload,
            };
        case `DELETE_TASK`:
            return {
                ...state,
                tasks: action.payload,
            };
        case `ADDNEWTASK_OPEN`:
            return {
                ...state,
                addNewTaskOpen: action.payload,
            };
        case `EDITTASK_OPEN`:
            return {
                ...state,
                editTaskOpen: action.payload,
            };
        case `DELETETASK_OPEN`:
            return {
                ...state,
                deleteTaskOpen: action.payload,
            };
        case `ADDTASK_OPEN`:
            return {
                ...state,
                addTaskOpen: action.payload,
            };
        case `TASKMODAL_OPEN`:
            return {
                ...state,
                taskModalOpen: action.payload,
            };
        case `DELETE_SUBTASK_OPEN`:
            return {
                ...state,
                deleteSubTaskOpen: action.payload,
            };
        case `UPDATE_TASKS`:
            return {
                ...state,
                updateTasks: action.payload,
            };
        case `RESET_TASK_CONTEXT`:
            return {
                todoTasks: [],
                inProgressTasks: [],
                doneTasks: [],
                addSubtaskArray: [],
                addNewSubtaskArray: [],
                editedTask: [],
                addTaskOpen: false,
                taskBoardTitle: null,
                taskBoards: "",
                updateTaskBoards: false,
                allTaskBoardTitles: "",
                currentBoardTasks: null,
                allUserTasks: [],
                selectedTaskId: "",
                selectedTask: null,
                addNewTaskOpen: false,
                editTaskOpen: false,
                taskModalOpen: false,
                deleteTaskOpen: false,
                deleteSubTaskOpen: false,
                updateTasks: false,
            };

        default:
            return state;
    }
};

export const TasksContextProvider = ({ children }) => {
    // Initialising useReducer
    const [state, dispatchTask] = useReducer(tasksReducer, {
        todoTasks: [],
        inProgressTasks: [],
        doneTasks: [],
        addSubtaskArray: [],
        addNewSubtaskArray: [],
        editedTask: [],
        addTaskOpen: false,
        taskBoardTitle: null,
        taskBoards: "",
        updateTaskBoards: false,
        allTaskBoardTitles: "",
        currentBoardTasks: null,
        allUserTasks: [],
        selectedTaskId: "",
        selectedTask: null,
        addNewTaskOpen: false,
        editTaskOpen: false,
        taskModalOpen: false,
        deleteTaskOpen: false,
        deleteSubTaskOpen: false,
        updateTasks: false,
    });

    return (
        <TasksContext.Provider value={{ ...state, dispatchTask }}>
            {children}
        </TasksContext.Provider>
    );
};
