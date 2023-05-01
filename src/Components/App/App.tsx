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
import ViewList from "../Sections/ViewList/ViewList";

const NavigationContext = createContext<any>({});
const BottomContext = createContext<Function>(() => { });

const App: FC = (): JSX.Element => {
  const [currentUser] = useAuthState(auth);
  const [addListButtonClassList, setAddListButtonClassList] = useState("small");
  const [currentPage, setCurrentPage] = useState<["main"] | ["add-list"] | ["view-list", string]>(["main"]);
  const [pageTitle, setPageTitle] = useState<string>("FinIt");

  const [bottomText, setBottomText] = useState<string>("");

  useEffect(() => {
    console.log(bottomText);
  }, [bottomText]);

  useEffect(() => {
    setAddListButtonClassList(currentPage[0] === "main" ? "small" : "small walnut-brown-bg");
  }, [currentPage])


  const handleNavigation = (): void => {
    const toNavigateTo = currentPage[0] === "main" ? "add-list" : "main";
    setCurrentPage([toNavigateTo]);
    console.log(toNavigateTo);
    if (toNavigateTo === "main") setPageTitle("FinIt");
    setBottomText("");
  }

  return (
    <BottomContext.Provider value={setBottomText}>
      <NavigationContext.Provider value={{ handleNavigation, addListButtonClassList, currentPage, setCurrentPage, setPageTitle, pageTitle }}>

        <Header />

        {currentPage[0] === "main" ? (currentUser ? <ListsList /> : <SignIn />) : currentPage[0] === "add-list" ? <AddList /> : <ViewList id={currentPage[1]} />}
        {bottomText.length > 0 && <p className="bottom-text beaver-bg rounded">{bottomText}</p>}
      </NavigationContext.Provider>
      {/* <ListsList /> */}
    </BottomContext.Provider>
  );
}

export default App;
export { NavigationContext, BottomContext };