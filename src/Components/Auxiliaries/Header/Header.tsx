import React, { FC, useState, useContext } from "react";
import "./Header.css";
import { NavigationContext, BottomContext } from "../../App/App";

const Header: FC = (): JSX.Element => {
    const { handleNavigation, addListButtonClassList, currentPage, setPageTitle, pageTitle } = useContext(NavigationContext);
    console.log(handleNavigation, addListButtonClassList, currentPage);
    const setBottomText = useContext(BottomContext);

    return (
        <>
            <header>
                <button className={addListButtonClassList + " back-btn centered-horizontal"} onClick={handleNavigation}>
                    {currentPage[0] === "main" ? "+" : "<~"}
                </button>
                <h1 className="centered bold" onClick={() => { }}>{pageTitle}</h1>
            </header>
        </>
    )
}

export default Header;