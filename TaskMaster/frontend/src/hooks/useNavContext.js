// imports for useContext Hook
import { NavContext } from "../context/navContext";
import { useContext } from "react";

// export useTasksContext hook
export const useNavContext = () => {
    const context = useContext(NavContext);

    if (!context) {
        throw Error(`useNavContext must be used inside NavContext.Provider`);
    }

    return context;
};
