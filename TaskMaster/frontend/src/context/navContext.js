// Context created for the nav menu open states
import { createContext, useReducer } from "react";

// Invoking an instance of createContext
export const NavContext = createContext();

// Getting the user theme preference
export const getCurrentTheme = () => {
    let theme = window.matchMedia(`(prefers-color-scheme: dark)`).matches ? true : false;

    localStorage.setItem("darkMode", JSON.stringify(theme));

    return theme;
};

// Set the color theme
export const setTheme = () => {
    const darkMode = JSON.parse(localStorage.getItem("darkMode"));

    // Gets the html
    const root = document.documentElement;

    // Sets the custom theme attribute to the opposite of the current
    if (darkMode === true) {
        root.setAttribute("theme", "light");
        localStorage.setItem("darkMode", JSON.stringify(false));
        return false;
    }
    // Sets the custom theme attribute to the opposite of the current
    else if (darkMode === false) {
        root.setAttribute("theme", "dark");
        localStorage.setItem("darkMode", JSON.stringify(true));
        return true;
    }
};

// Setting up the reducer function
export const NavReducer = (state, action) => {
    switch (action.type) {
        case `PRIMARYNAV_OPEN`:
            return {
                ...state,
                primaryNavOpen: action.payload,
            };
        case `SETINGS_OPEN`:
            return {
                ...state,
                settingsOpen: action.payload,
            };
        case `SET_USERTHEME`:
            return {
                ...state,
                darkMode: action.payload,
            };
        case `DELETEBOARD_OPEN`:
            return {
                ...state,
                deleteBoardOpen: action.payload,
            };
        case `EDITBOARD_OPEN`:
            return {
                ...state,
                editBoardOpen: action.payload,
            };
        case `ADDBOARD_OPEN`:
            return {
                ...state,
                addBoardOpen: action.payload,
            };
        case `SET_PAGETITLE`:
            return {
                ...state,
                pageTitle: action.payload,
            };
        default:
            return state;
    }
};

export const NavContextProvider = ({ children }) => {
    // Initialising useReducer
    const [state, dispatchNav] = useReducer(NavReducer, {
        primaryNavOpen: false,
        settingsOpen: false,
        deleteBoardOpen: false,
        editBoardOpen: false,
        addBoardOpen: false,
        pageTitle: "",
    });

    return (
        <NavContext.Provider value={{ ...state, dispatchNav }}>
            {children}
        </NavContext.Provider>
    );
};
