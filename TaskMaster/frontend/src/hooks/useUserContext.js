// imports for useContext Hook
import { UserContext } from "../context/userContext";
import { useContext } from "react";

// export useTasksContext hook
export const useUserContext = () => {
    const context = useContext(UserContext);

    if (!context) {
        throw Error(`UserContext must be used inside UserContext.Provider`);
    }

    return context;
};
