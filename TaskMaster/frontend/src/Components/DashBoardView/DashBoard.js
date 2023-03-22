// DASHBOARD
import React from "react";

// Components
// import UserDashBoard from "./UserDashBoard";
import AdminDashBoard from "./AdminDashBoard";
import UserDashBoard from "./UserDashBoard";

// State/Context
import { useUserContext } from "../../hooks/useUserContext";

// CSS
import "./DashBoard.css";

const DashBoard = () => {
    // Making the Contexts avaliable
    const { userName, userIsAdmin } = useUserContext();

    return (
        <>
            <div className="dashboard even-spacing-m">
                <h1 className="h-xl">
                    Welcome, <span className="username-greeting">{userName}</span>!
                </h1>
                {userIsAdmin ? <AdminDashBoard /> : <UserDashBoard />}
            </div>
        </>
    );
};

export default DashBoard;
