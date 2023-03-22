import { React } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Pages
import Login from "./Pages/Login";
import Home from "./Pages/Home";

// Home page View Components
import TaskView from "./Components/TaskView/TaskView";
import DashBoard from "./Components/DashBoardView/DashBoard";

import { useUserContext } from "./hooks/useUserContext";

// Css
import "./App.css";

// Creates the browser router and routes using elements
function App() {
    // Making userContext available
    const { isUserVerified } = useUserContext();
    const userVerified = localStorage.getItem(`userVerified`);
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/login"
                    element={
                        isUserVerified || userVerified ? (
                            <Navigate to="/dashboard" />
                        ) : (
                            <Login />
                        )
                    }
                />
                <Route
                    path="/dashboard"
                    element={
                        isUserVerified || userVerified ? (
                            <Home component={<DashBoard />} />
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />
                <Route
                    path="/tasks"
                    element={
                        isUserVerified || userVerified ? (
                            <Home component={<TaskView />} />
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />
                <Route path="/*" element={<Navigate to="/dashboard" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
