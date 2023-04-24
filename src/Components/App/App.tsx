import React, { createContext, FC, useEffect, useState } from "react";
import "../General.css";
import "./App.css";
import { auth } from "../../firebase-config";
import { useAuthState } from "react-firebase-hooks/auth";
import Header from "../Auxiliaries/Header/Header";
import SignIn from "../Auxiliaries/SignIn/SignIn";
import NothingHere from "../Auxiliaries/NothingHere/NothingHere";
import AddList from "../Sections/AddList/AddList";
import ListsList from "../Sections/ListsList/ListsList";

const NavigationContext = createContext<any>({});
const BottomContext = createContext<Function>(() => { });

const App: FC = (): JSX.Element => {
  const [currentUser] = useAuthState(auth);
  const [addListButtonClassList, setAddListButtonClassList] = useState("small");
  const [currentPage, setCurrentPage] = useState<"main" | "add-list">("main");

  const [bottomText, setBottomText] = useState<string>("");

  useEffect(() => {
    console.log(bottomText);
  }, [bottomText]);


  const handleNavigation = (): void => {
    const toNavigateTo = currentPage === "main" ? "add-list" : "main";
    setCurrentPage(toNavigateTo);
    setAddListButtonClassList(toNavigateTo === "main" ? "small" : "small walnut-brown-bg");
    setBottomText("");
  }

  return (
    <BottomContext.Provider value={setBottomText}>
      <NavigationContext.Provider value={{ handleNavigation, addListButtonClassList, currentPage }}>
        <Header />
      </NavigationContext.Provider>
      {currentPage === "main" ? (currentUser ? <ListsList /> : <SignIn />) : <AddList />}
      <p className="bottom-text">{bottomText}</p>
      {/* <ListsList /> */}
    </BottomContext.Provider>
  );
}

export default App;
export { NavigationContext, BottomContext };