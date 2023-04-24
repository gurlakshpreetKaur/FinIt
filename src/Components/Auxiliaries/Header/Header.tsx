import React, { FC, useState, useContext } from "react";
import "./Header.css";
import { NavigationContext, BottomContext } from "../../App/App";

const Header: FC = (): JSX.Element => {
    const { handleNavigation, addListButtonClassList, currentPage } = useContext(NavigationContext);
    const setBottomText = useContext(BottomContext);

    return (
        <>
            <header>
                <button className={addListButtonClassList + " back-btn centered-horizontal"} onClick={handleNavigation}>
                    {currentPage === "main" ? "+" : "<~"}
                </button>
                <h1 className="centered bold" onClick={() => { }}>FinIt</h1>
            </header>
        </>
    )
}

export default Header;