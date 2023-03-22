// Context created for the user authentication and status
import { createContext, useReducer } from "react";

// Invoking an instance of createContext
export const UserContext = createContext();

// Setting up the reducer function
export const userReducer = (state, action) => {
    switch (action.type) {
        case `SET_ISUSERADMIN`:
            localStorage.setItem("userIsAdmin", action.payload);
            return {
                ...state,
                userIsAdmin: action.payload,
            };
        case `SET_ISNEWUSER`:
            localStorage.setItem("isNewUser", action.payload);
            return {
                ...state,
                isNewUser: action.payload,
            };
        case `SET_USER_ID`:
            localStorage.setItem("userId", action.payload);
            return {
                ...state,
                userId: action.payload,
            };
        case `SET_USERNAME`:
            localStorage.setItem("userName", action.payload);
            return {
                ...state,
                userName: action.payload,
            };
        case `SET_USER_DELETE_OPEN`:
            return {
                ...state,
                deleteUserModalOpen: action.payload,
            };
        case `SET_DELETE_USER`:
            return {
                ...state,
                deleteUser: action.payload,
            };
        case `SET_IS_USER_VERIFIED`:
            return {
                ...state,
                isUserVerified: action.payload,
            };
        case `SET_USER_TOKEN`:
            return {
                ...state,
                isUserVerified: action.payload,
            };
        case `RESET_USER_CONTEXT`:
            return {
                userIsAdmin: localStorage.getItem("userIsAdmin") === "true" || false,
                isNewUser: localStorage.getItem("isNewUser") === "true" || false,
                userId: localStorage.getItem("userId"),
                userName: localStorage.getItem("userName") || null,
                deleteUserModalOpen: false,
                deleteUser: null,
                isUserVerified: false,
                userToken: null,
            };
        default:
            return state;
    }
};

export const UserContextProvider = ({ children }) => {
    // Initialise state values from localStorage, or use default values
    const [state, dispatchUser] = useReducer(userReducer, {
        userIsAdmin: localStorage.getItem("userIsAdmin") === "true" || false,
        isNewUser: localStorage.getItem("isNewUser") === "true" || false,
        userId: localStorage.getItem("userId") || null,
        userName: localStorage.getItem("userName") || null,
        deleteUserModalOpen: false,
        deleteUser: null,
        isUserVerified: false,
        userToken: null,
    });

    return (
        <UserContext.Provider value={{ ...state, dispatchUser }}>
            {children}
        </UserContext.Provider>
    );
};
