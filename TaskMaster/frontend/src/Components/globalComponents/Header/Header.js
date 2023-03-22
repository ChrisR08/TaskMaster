import React from "react";

// Components
import PrimaryNav from "./PrimaryNav";
import AddTaskBtn from "../AddTaskBtn";
import Settings from "./Settings";

// CSS
import "./Header.css";

function Header({ pageTitle }) {
    return (
        <header className="header-wrapper flex align-center">
            <div className="header-container site-container flex align-center">
                <div className="header-btns-container flex align-center">
                    <PrimaryNav pageTitle={pageTitle} />
                </div>

                <div className="header-btns-container flex align-center">
                    <AddTaskBtn pageTitle={pageTitle} />
                    <Settings pageTitle={pageTitle} />
                </div>
            </div>
        </header>
    );
}

export default Header;
