// PRIMARY NAV
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

// Importing the Global Context
import { useNavContext } from "../../../hooks/useNavContext";
import { useTasksContext } from "../../../hooks/useTasksContext";

// Import setTheme function
import { setTheme } from "../../../context/navContext";

// CSS
import "./PrimaryNav.css";

function PrimaryNav({ pageTitle }) {
    // Creating an instance of useNavigate
    const navigate = useNavigate();

    // Making navContext available
    const {
        primaryNavOpen,
        settingsOpen,
        addBoardOpen,
        deleteBoardOpen,
        darkMode,
        editBoardOpen,
        dispatchNav,
    } = useNavContext();

    // Making taskContext available
    const { allTaskBoardTitles, taskBoardTitle, dispatchTask } = useTasksContext();

    // ========================================================================

    // Disable primary nav button if page equals login or signup
    const disableBtn = (pageTitle) => {
        if (
            pageTitle.toLowerCase() === "log in" ||
            pageTitle.toLowerCase() === "sign up"
        ) {
            return true;
        } else return false;
    };

    // ========================================================================

    // Gets the current path to use to conditionally render elements
    const location = useLocation();
    const currentUrl = location.pathname;

    // Close the nav-menu when a link is clicked
    const closeMenu = () => {
        dispatchNav({ type: `PRIMARYNAV_OPEN`, payload: !primaryNavOpen });
    };

    // Open the add board modal
    const openAddBoard = () => {
        dispatchNav({ type: `ADDBOARD_OPEN`, payload: !addBoardOpen });

        // Close the menu
        closeMenu();
    };

    // Open the edit board modal
    const openEditBoard = () => {
        dispatchNav({ type: `EDITBOARD_OPEN`, payload: !editBoardOpen });

        // Close the menu
        closeMenu();
    };

    // Open the delete board modal
    const openDeleteBoard = () => {
        dispatchNav({ type: `DELETEBOARD_OPEN`, payload: !deleteBoardOpen });

        // Close the menu
        closeMenu();
    };

    // Link to board
    const setBoardTitle = (e) => {
        const boardTitle = e.target.innerText;
        dispatchTask({ type: `SET_TASKBOARDTITLE`, payload: boardTitle });
        localStorage.setItem(`taskBoardTitle`, boardTitle);
        closeMenu();
        navigate("/tasks");
    };

    // ========================================================================

    // Conditionally set classes for the nav element
    const navClasses = primaryNavOpen
        ? "mob-menu mob-menu-open mob-menu-responsive"
        : "mob-menu mob-menu-responsive";

    // Conditionally set classes for the nav icon
    const navIconClasses = primaryNavOpen ? "nav-icon nav-icon-open" : "nav-icon";

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

    // handles clicking on the primary nav menu btn
    const handleMobBtnClick = (e) => {
        e.preventDefault();
        dispatchNav({ type: `PRIMARYNAV_OPEN`, payload: !primaryNavOpen });

        if (settingsOpen) {
            dispatchNav({ type: `SETINGS_OPEN`, payload: !settingsOpen });
        }
    };

    // ========================================================================

    const isLoginPage = location.pathname === "/login";

    return (
        <>
            <button
                className="primary-nav-btn-mobile align-center"
                onClick={handleMobBtnClick}
                disabled={disableBtn(pageTitle)}
            >
                <img
                    className={navIconClasses}
                    src="/images/logo-mobile.svg"
                    alt="TaskMaster Logo"
                />
                <h1 className="h-l app-title">TaskMaster</h1>
            </button>
            <div className="primary-nav-btn-desktop align-center">
                <img
                    className={navIconClasses}
                    src="/images/logo-mobile.svg"
                    alt="TaskMaster Logo"
                />
                <h1 className="h-l app-title">TaskMaster</h1>
            </div>
            {primaryNavOpen && (
                <div className={navClasses}>
                    <div className="even-spacing-s">
                        <p className="h-m nav-title letter-spacing-m">
                            TaskBoards: {allTaskBoardTitles.length}
                        </p>

                        <nav className="primary-nav flex flex-col">
                            <ul className="nav-ul even-spacing-xs">
                                {allTaskBoardTitles &&
                                    allTaskBoardTitles.length > 0 &&
                                    allTaskBoardTitles.map((taskBoard, index) => {
                                        return (
                                            <li key={index} className="nav-li">
                                                <button
                                                    onClick={setBoardTitle}
                                                    className="nav-tab flex align-center"
                                                    disabled={!primaryNavOpen}
                                                >
                                                    <p className="h-m nav-tab-title clickable-parent">
                                                        {taskBoard.toLowerCase()}
                                                    </p>
                                                    <svg
                                                        className="icon-board"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            className="task-board-icon"
                                                            d="M0 2.889A2.889 2.889 0 0 1 2.889 0H13.11A2.889 2.889 0 0 1 16 2.889V13.11A2.888 2.888 0 0 1 13.111 16H2.89A2.889 2.889 0 0 1 0 13.111V2.89Zm1.333 5.555v4.667c0 .859.697 1.556 1.556 1.556h6.889V8.444H1.333Zm8.445-1.333V1.333h-6.89A1.556 1.556 0 0 0 1.334 2.89V7.11h8.445Zm4.889-1.333H11.11v4.444h3.556V5.778Zm0 5.778H11.11v3.11h2a1.556 1.556 0 0 0 1.556-1.555v-1.555Zm0-7.112V2.89a1.555 1.555 0 0 0-1.556-1.556h-2v3.111h3.556Z"
                                                        />
                                                    </svg>
                                                </button>
                                            </li>
                                        );
                                    })}
                            </ul>
                        </nav>

                        <ul className="nav-ul board even-spacing-xs">
                            {/* Add Board Button */}
                            <li className="nav-li">
                                <button
                                    onClick={openAddBoard}
                                    className="nav-tab flex align-center"
                                    disabled={!primaryNavOpen}
                                >
                                    <svg
                                        className="settings-icon"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            className="settings-board-icon"
                                            d="M0 2.889A2.889 2.889 0 0 1 2.889 0H13.11A2.889 2.889 0 0 1 16 2.889V13.11A2.888 2.888 0 0 1 13.111 16H2.89A2.889 2.889 0 0 1 0 13.111V2.89Zm1.333 5.555v4.667c0 .859.697 1.556 1.556 1.556h6.889V8.444H1.333Zm8.445-1.333V1.333h-6.89A1.556 1.556 0 0 0 1.334 2.89V7.11h8.445Zm4.889-1.333H11.11v4.444h3.556V5.778Zm0 5.778H11.11v3.11h2a1.556 1.556 0 0 0 1.556-1.555v-1.555Zm0-7.112V2.89a1.555 1.555 0 0 0-1.556-1.556h-2v3.111h3.556Z"
                                        />
                                    </svg>
                                    <p className="h-m nav-tab-title clickable-parent">
                                        Add Board
                                    </p>
                                </button>
                            </li>

                            {/* Conditonally renders the Edit/Delete Board Buttons */}
                            {currentUrl === "/tasks" && allTaskBoardTitles.length > 0 ? (
                                <>
                                    <li className="nav-li">
                                        <button
                                            disabled={!primaryNavOpen}
                                            onClick={openEditBoard}
                                            className="nav-tab flex align-center"
                                        >
                                            <svg
                                                className="settings-icon"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    className="settings-board-icon"
                                                    d="M0 2.889A2.889 2.889 0 0 1 2.889 0H13.11A2.889 2.889 0 0 1 16 2.889V13.11A2.888 2.888 0 0 1 13.111 16H2.89A2.889 2.889 0 0 1 0 13.111V2.89Zm1.333 5.555v4.667c0 .859.697 1.556 1.556 1.556h6.889V8.444H1.333Zm8.445-1.333V1.333h-6.89A1.556 1.556 0 0 0 1.334 2.89V7.11h8.445Zm4.889-1.333H11.11v4.444h3.556V5.778Zm0 5.778H11.11v3.11h2a1.556 1.556 0 0 0 1.556-1.555v-1.555Zm0-7.112V2.89a1.555 1.555 0 0 0-1.556-1.556h-2v3.111h3.556Z"
                                                />
                                            </svg>
                                            <p className="h-m settings-p">Edit Board</p>
                                        </button>
                                    </li>

                                    <li className="nav-li">
                                        <button
                                            disabled={!primaryNavOpen}
                                            onClick={openDeleteBoard}
                                            className="nav-tab flex align-center"
                                        >
                                            <svg
                                                className="icon-board"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    className="delete-board-icon"
                                                    d="M0 2.889A2.889 2.889 0 0 1 2.889 0H13.11A2.889 2.889 0 0 1 16 2.889V13.11A2.888 2.888 0 0 1 13.111 16H2.89A2.889 2.889 0 0 1 0 13.111V2.89Zm1.333 5.555v4.667c0 .859.697 1.556 1.556 1.556h6.889V8.444H1.333Zm8.445-1.333V1.333h-6.89A1.556 1.556 0 0 0 1.334 2.89V7.11h8.445Zm4.889-1.333H11.11v4.444h3.556V5.778Zm0 5.778H11.11v3.11h2a1.556 1.556 0 0 0 1.556-1.555v-1.555Zm0-7.112V2.89a1.555 1.555 0 0 0-1.556-1.556h-2v3.111h3.556Z"
                                                />
                                            </svg>
                                            <p className="h-m settings-p">Delete Board</p>
                                        </button>
                                    </li>
                                </>
                            ) : null}
                        </ul>
                    </div>
                    {/* Theme Color Mode Selector */}
                    <li className="theme-mode-wrapper primary flex center-xy border-radius-s">
                        <div className="theme-mode-container primary flex align-center">
                            <img
                                className="theme-mode-icon"
                                src="/icons/icon-light-theme.svg"
                                alt="Light mode icon"
                            />
                            <button
                                type="button"
                                onClick={toggleTheme}
                                className={themeToggleClasses}
                            ></button>
                            <img
                                className="theme-mode-icon"
                                src="/icons/icon-dark-theme.svg"
                                alt="Dark mode icon"
                            />
                        </div>
                    </li>
                </div>
            )}
            {/* DESKTOP 1025px + */}
            <div className={isLoginPage ? "hide" : "desktop-menu"}>
                <div className="even-spacing-s">
                    <p className="h-m nav-title letter-spacing-m">
                        TaskBoards: {allTaskBoardTitles.length}
                    </p>

                    <nav className="primary-nav flex flex-col">
                        <ul className="nav-ul even-spacing-xs">
                            {allTaskBoardTitles &&
                                allTaskBoardTitles.length > 0 &&
                                allTaskBoardTitles.map((taskBoard, index) => {
                                    return (
                                        <li key={index} className="nav-li">
                                            <button
                                                onClick={setBoardTitle}
                                                // Sets tab to active in the UI
                                                className={
                                                    taskBoard === taskBoardTitle
                                                        ? "nav-tab flex align-center active-taskBoard"
                                                        : "nav-tab flex align-center"
                                                }
                                            >
                                                <p className="h-m nav-tab-title clickable-parent">
                                                    {taskBoard.toLowerCase()}
                                                </p>
                                                <svg
                                                    className="icon-board"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        className="task-board-icon"
                                                        d="M0 2.889A2.889 2.889 0 0 1 2.889 0H13.11A2.889 2.889 0 0 1 16 2.889V13.11A2.888 2.888 0 0 1 13.111 16H2.89A2.889 2.889 0 0 1 0 13.111V2.89Zm1.333 5.555v4.667c0 .859.697 1.556 1.556 1.556h6.889V8.444H1.333Zm8.445-1.333V1.333h-6.89A1.556 1.556 0 0 0 1.334 2.89V7.11h8.445Zm4.889-1.333H11.11v4.444h3.556V5.778Zm0 5.778H11.11v3.11h2a1.556 1.556 0 0 0 1.556-1.555v-1.555Zm0-7.112V2.89a1.555 1.555 0 0 0-1.556-1.556h-2v3.111h3.556Z"
                                                    />
                                                </svg>
                                            </button>
                                        </li>
                                    );
                                })}
                        </ul>
                    </nav>

                    <ul className="nav-ul board even-spacing-xs">
                        {/* Add Board Button */}
                        <li className="nav-li">
                            <button
                                onClick={openAddBoard}
                                className="nav-tab flex align-center"
                            >
                                <svg
                                    className="settings-icon"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        className="settings-board-icon"
                                        d="M0 2.889A2.889 2.889 0 0 1 2.889 0H13.11A2.889 2.889 0 0 1 16 2.889V13.11A2.888 2.888 0 0 1 13.111 16H2.89A2.889 2.889 0 0 1 0 13.111V2.89Zm1.333 5.555v4.667c0 .859.697 1.556 1.556 1.556h6.889V8.444H1.333Zm8.445-1.333V1.333h-6.89A1.556 1.556 0 0 0 1.334 2.89V7.11h8.445Zm4.889-1.333H11.11v4.444h3.556V5.778Zm0 5.778H11.11v3.11h2a1.556 1.556 0 0 0 1.556-1.555v-1.555Zm0-7.112V2.89a1.555 1.555 0 0 0-1.556-1.556h-2v3.111h3.556Z"
                                    />
                                </svg>
                                <p className="h-m nav-tab-title clickable-parent">
                                    Add Board
                                </p>
                            </button>
                        </li>

                        {/* Conditonally renders the Edit/Delete Board Buttons */}
                        {currentUrl === "/tasks" && allTaskBoardTitles.length > 0 ? (
                            <>
                                <li className="nav-li">
                                    <button
                                        onClick={openEditBoard}
                                        className="nav-tab flex align-center"
                                    >
                                        <svg
                                            className="settings-icon"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                className="settings-board-icon"
                                                d="M0 2.889A2.889 2.889 0 0 1 2.889 0H13.11A2.889 2.889 0 0 1 16 2.889V13.11A2.888 2.888 0 0 1 13.111 16H2.89A2.889 2.889 0 0 1 0 13.111V2.89Zm1.333 5.555v4.667c0 .859.697 1.556 1.556 1.556h6.889V8.444H1.333Zm8.445-1.333V1.333h-6.89A1.556 1.556 0 0 0 1.334 2.89V7.11h8.445Zm4.889-1.333H11.11v4.444h3.556V5.778Zm0 5.778H11.11v3.11h2a1.556 1.556 0 0 0 1.556-1.555v-1.555Zm0-7.112V2.89a1.555 1.555 0 0 0-1.556-1.556h-2v3.111h3.556Z"
                                            />
                                        </svg>
                                        <p className="h-m settings-p">Edit Board</p>
                                    </button>
                                </li>

                                <li className="nav-li">
                                    <button
                                        onClick={openDeleteBoard}
                                        className="nav-tab flex align-center"
                                    >
                                        <svg
                                            className="icon-board"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                className="delete-board-icon"
                                                d="M0 2.889A2.889 2.889 0 0 1 2.889 0H13.11A2.889 2.889 0 0 1 16 2.889V13.11A2.888 2.888 0 0 1 13.111 16H2.89A2.889 2.889 0 0 1 0 13.111V2.89Zm1.333 5.555v4.667c0 .859.697 1.556 1.556 1.556h6.889V8.444H1.333Zm8.445-1.333V1.333h-6.89A1.556 1.556 0 0 0 1.334 2.89V7.11h8.445Zm4.889-1.333H11.11v4.444h3.556V5.778Zm0 5.778H11.11v3.11h2a1.556 1.556 0 0 0 1.556-1.555v-1.555Zm0-7.112V2.89a1.555 1.555 0 0 0-1.556-1.556h-2v3.111h3.556Z"
                                            />
                                        </svg>
                                        <p className="h-m settings-p">Delete Board</p>
                                    </button>
                                </li>
                            </>
                        ) : null}
                    </ul>
                </div>
                {/* Theme Color Mode Selector */}
                <li className="theme-mode-wrapper flex center-xy border-radius-s">
                    <div className="theme-mode-container primary flex align-center">
                        <img
                            className="theme-mode-icon"
                            src="/icons/icon-light-theme.svg"
                            alt="Light mode icon"
                        />
                        <button
                            type="button"
                            onClick={toggleTheme}
                            className={themeToggleClasses}
                        ></button>
                        <img
                            className="theme-mode-icon"
                            src="/icons/icon-dark-theme.svg"
                            alt="Dark mode icon"
                        />
                    </div>
                </li>
            </div>
        </>
    );
}

export default PrimaryNav;
