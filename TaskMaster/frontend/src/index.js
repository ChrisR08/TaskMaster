import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Importing ContextProviders to provide state globally for their children
import { UserContextProvider } from "./context/userContext";
import { TasksContextProvider } from "./context/taskContext";
import { NavContextProvider } from "./context/navContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

function Index() {
    // The App is wrapped in the BrowserRouter and Context.Provider here for Global Scope
    return (
        <React.StrictMode>
            <UserContextProvider>
                <TasksContextProvider>
                    <NavContextProvider>
                        <App />
                    </NavContextProvider>
                </TasksContextProvider>
            </UserContextProvider>
        </React.StrictMode>
    );
}
// Renders the Index function in the DOM
root.render(<Index />);
