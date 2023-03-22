// SETTINGS
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Express API URL
import apiURL from "../../../apiConfig";

// Importing the global state
import { useNavContext } from "../../../hooks/useNavContext";
import { useUserContext } from "../../../hooks/useUserContext";
import { useTasksContext } from "../../../hooks/useTasksContext";

// Import setTheme function
import { getCurrentTheme, setTheme } from "../../../context/navContext";

// CSS
import "./Settings.css";

function Settings({ pageTitle }) {
    // Making Contexts available
    const { primaryNavOpen, settingsOpen, darkMode, dispatchNav } = useNavContext();

    const { userName, dispatchUser } = useUserContext();

    const { dispatchTask } = useTasksContext();

    // Creating an instance of useNavigate
    const navigate = useNavigate();

    // ========================================================================
    // Disable settings button if page equals login or signup
    const disableBtn = (pageTitle) => {
        if (
            pageTitle.toLowerCase() === "log in" ||
            pageTitle.toLowerCase() === "sign up"
        ) {
            return true;
        } else return false;
    };

    // ========================================================================

    // Conditionally setting classes based on the state
    const settingsClasses = settingsOpen ? "settings settings-open" : "settings";

    const handleSettingsClick = (e) => {
        e.preventDefault();
        dispatchNav({ type: `SETINGS_OPEN`, payload: !settingsOpen });

        if (primaryNavOpen) {
            dispatchNav({ type: `PRIMARYNAV_OPEN`, payload: !primaryNavOpen });
        }
    };

    // ========================================================================

    // Close the settings menu when a link is clicked
    const closeMenu = () => {
        dispatchNav({ type: `SETINGS_OPEN`, payload: !settingsOpen });
    };

    const handleDashboardClick = () => {
        // Navigate to the home/dashboard view
        navigate("/");

        // Close the menu
        closeMenu();
    };

    // ========================================================================

    // Log the user out of the app
    const logout = async () => {
        // Set loggedIn to false in local storage
        dispatchUser({ type: `SET_LOGGEDIN`, payload: false });

        // API call to logout
        try {
            const response = await fetch(`${apiURL}/auth/logout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();

            if (data.msg === `User logged out`) {
                // Redirect the user to the login page
                navigate("/login");
            }
        } catch (error) {
            console.log(error);
        }

        // Clear session, local and state storage
        sessionStorage.clear();
        localStorage.clear();

        dispatchTask({ type: `RESET_TASK_CONTEXT` });
        dispatchUser({ type: `RESET_USER_CONTEXT` });

        // Close the menu
        closeMenu();
    };

    // ========================================================================

    // Setting the user theme preference to sessionStorage and state
    // Empty dependancy to only run once on mount
    useEffect(() => {
        const theme = getCurrentTheme();
        dispatchNav({ type: `SET_USERTHEME`, payload: theme });
        // eslint-disable-next-line
    }, []);

    // Toggle the button in the UI
    const themeToggleClasses = darkMode
        ? "theme-mode-btn border-radius-l"
        : "toggle-theme theme-mode-btn  border-radius-l";

    // Toggles the theme mode
    const toggleTheme = (e) => {
        e.preventDefault();
        const darkMode = setTheme();
        dispatchNav({ type: `SET_USERTHEME`, payload: darkMode });
    };

    // ========================================================================

    return (
        <>
            {/* Open Menu Button */}
            <button
                className="settings-btn"
                onClick={handleSettingsClick}
                disabled={disableBtn(pageTitle)}
            >
                <div className="user-wrapper flex">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="user-icon header"
                    >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <p className="h-l username-mob">{userName}</p>
                </div>
            </button>

            {settingsOpen && (
                <nav className={settingsClasses}>
                    <ul className="site-container even-spacing-m">
                        {/* DashBoard Button */}
                        <li className="settings-li">
                            <button
                                onClick={handleDashboardClick}
                                className="settings-btn flex"
                                disabled={!settingsOpen}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="user-icon"
                                >
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                                <p className="h-m settings-p">My Dashboard</p>
                            </button>
                        </li>

                        {/* Log Out Button */}
                        <li className="settings-li">
                            <button
                                onClick={logout}
                                className="settings-btn flex"
                                disabled={!settingsOpen}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="logout-svg"
                                >
                                    <path
                                        className="logout-icon"
                                        d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
                                    ></path>
                                    <polyline
                                        className="logout-icon"
                                        points="16 17 21 12 16 7"
                                    ></polyline>
                                    <line
                                        className="logout-icon"
                                        x1="21"
                                        y1="12"
                                        x2="9"
                                        y2="12"
                                    ></line>
                                </svg>
                                <p className="h-m settings-p">Log Out</p>
                            </button>
                        </li>
                        {/* Theme Color Mode Selector */}
                        <li className="theme-mode-wrapper mobile flex center-xy border-radius-s">
                            <div className="theme-mode-container flex align-center">
                                <img
                                    className="theme-mode-icon"
                                    src="/icons/icon-light-theme.svg"
                                    alt="Light mode icon"
                                />
                                <button
                                    type="button"
                                    onClick={toggleTheme}
                                    className={themeToggleClasses}
                                    disabled={!settingsOpen}
                                ></button>
                                <img
                                    className="theme-mode-icon"
                                    src="/icons/icon-dark-theme.svg"
                                    alt="Dark mode icon"
                                />
                            </div>
                        </li>
                    </ul>
                </nav>
            )}
        </>
    );
}

export default Settings;
