import React, { FC, useState, useEffect, useContext } from "react";
import "./ListsList.css";
import { query, collection, where } from "@firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, useDocumentsData, useDocument, useIDOfDocuments } from "../../../firebase-config";
import ListsListBlock from "../../Auxiliaries/ListsListBlock/ListsListBlock";
import { NavigationContext } from "../../App/App";
import NothingHere from "../../Auxiliaries/NothingHere/NothingHere";
import { listDocument } from "../../../interfacesAndUtil";


const ListsList = (): JSX.Element => {
    const { handleNavigation, addListButtonClassList, currentPage } = useContext(NavigationContext);
    // console.log(NavigationContext.displayName);
    const [currentUser] = useAuthState(auth);
    const [dataToDisplay, error] = useDocumentsData<listDocument>(query(collection(db, "lists"), where("ownedBy", "==", currentUser?.email)));
    const [ownedListsIDs, err] = useIDOfDocuments(query(collection(db, "lists"), where("ownedBy", "==", currentUser?.email)));

    return (
        <section className="lists-list">
            {dataToDisplay.length > 0 ? dataToDisplay.sort((a, b) => -(a.createdAt + a.createdOn).localeCompare(b.createdAt + b.createdOn)).map((item) => <ListsListBlock id={item.id} key={item.id} />) : <NothingHere />}
        </section>
    )
}

export default ListsList;