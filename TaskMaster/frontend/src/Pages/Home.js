import React, { useEffect } from "react";

// Import setTheme function
import { getAllTaskBoards } from "../context/taskContext";

// Components
import Header from "../Components/globalComponents/Header/Header";
import AddTask from "../Components/globalComponents/Header/AddTask";
import AddBoard from "../Components/globalComponents/AddBoard";
import EditTask from "../Components/TaskView/EditTask";
import TaskModal from "../Components/TaskView/TaskModal";
import DeleteTask from "../Components/TaskView/DeleteTask";
import DeleteBoard from "../Components/globalComponents/DeleteBoard";
import EditBoard from "../Components/globalComponents/EditBoard";

// Global State
import { useTasksContext } from "../hooks/useTasksContext";
import { useNavContext } from "../hooks/useNavContext";

// CSS
import "./forms.css";

function Home({ component }) {
    // Making the Contexts avaliable
    const {
        updateTaskBoards,
        currentBoardTasks,
        taskBoardTitle,
        addTaskOpen,
        editTaskOpen,
        taskModalOpen,
        deleteTaskOpen,
        dispatchTask,
    } = useTasksContext();

    const { editBoardOpen, addBoardOpen, deleteBoardOpen } = useNavContext();

    // ========================================================================

    // To display the current page title as the nav heading
    const pageTitle = "Home";

    // ========================================================================

    // Get the current user_ID
    const user_ID = localStorage.getItem(`userId`);

    // Fetching the TaskBoards to populate the nav li's
    const getTaskBoards = async (user_ID) => {
        if (user_ID) {
            const taskBoards = await getAllTaskBoards(user_ID);

            if (taskBoards.error) {
                console.log(taskBoards.error);
                return;
            }
            // Define array to store board titles
            let taskBoardTitles = [];
            // Error handling, prevents empty arrays being mapped by checking length
            if (taskBoards.taskBoards.length > 0) {
                taskBoardTitles = taskBoards.taskBoards.map((taskBoard) => {
                    return taskBoard.taskBoard;
                });

                localStorage.setItem(
                    "taskBoardTitle",
                    taskBoardTitles[0].replace(/"/g, "")
                );
                // If there is a taskBoardTitle in state then use it else use the first in the array
                const firstTaskBoard = taskBoardTitles[0].replace(/"/g, "");
                const defaultTaskBoard = taskBoardTitle
                    ? taskBoardTitle.trim()
                    : firstTaskBoard;

                localStorage.setItem("taskBoardTitle", defaultTaskBoard);

                dispatchTask({
                    type: `SET_TASKBOARDTITLE`,
                    payload: defaultTaskBoard,
                });

                dispatchTask({
                    type: `SET_ALLTASKBOARD_DATA`,
                    payload: taskBoards.taskBoards,
                });

                dispatchTask({
                    type: `SET_ALLTASKBOARDTITLES`,
                    payload: taskBoardTitles,
                });
            }
            // Else store null to prevent errors
            else if (taskBoards.taskBoards === 0) {
                localStorage.setItem("taskBoardTitle", null);

                dispatchTask({ type: `SET_TASKBOARDTITLE`, payload: null });

                dispatchTask({
                    type: `SET_ALLTASKBOARDTITLES`,
                    payload: taskBoardTitles,
                });
            }
        }
    };

    // Empty dependancy to only run once on mount
    useEffect(() => {
        getTaskBoards(user_ID);
        // eslint-disable-next-line
    }, [user_ID, updateTaskBoards, currentBoardTasks]);

    // ========================================================================

    return (
        <>
            <Header pageTitle={pageTitle} />
            <main className="site-container inner-content">{component}</main>
            {/* Only render the components if they are open to save re-render triggers */}
            {addBoardOpen && <AddBoard />}
            {addTaskOpen && <AddTask />}
            {editTaskOpen && <EditTask />}
            {taskModalOpen && <TaskModal />}
            {deleteTaskOpen && <DeleteTask />}
            {deleteBoardOpen && <DeleteBoard />}
            {editBoardOpen && <EditBoard />}
        </>
    );
}

export default Home;
