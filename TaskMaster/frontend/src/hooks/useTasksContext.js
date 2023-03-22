// imports for useContext Hook
import { TasksContext } from "../context/taskContext";
import { useContext } from "react";

// export useTasksContext hook
export const useTasksContext = () => {
    const context = useContext(TasksContext);

    if (!context) {
        throw Error(`useTasksContext must be used inside TasksContext.Provider`);
    }

    return context;
};
