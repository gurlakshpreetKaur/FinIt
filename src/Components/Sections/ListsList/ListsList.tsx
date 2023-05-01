import React, { FC, useState, useEffect, useContext } from "react";
import "./ListsList.css";
import { query, collection, where, onSnapshot, DocumentData } from "@firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../../firebase-config";
import ListsListBlock from "../../Auxiliaries/ListsListBlock/ListsListBlock";
import { NavigationContext } from "../../App/App";
import NothingHere from "../../Auxiliaries/NothingHere/NothingHere";
import { listDocument } from "../../../interfacesAndUtil";


const ListsList = (): JSX.Element => {
    const { handleNavigation, addListButtonClassList, currentPage } = useContext(NavigationContext);
    // console.log(NavigationContext.displayName);
    const [currentUser] = useAuthState(auth);
    const [dataToDisplay, setDataToDisplay] = useState<listDocument[]>([]);
    onSnapshot(query(collection(db, "lists"), where("ownedBy", "==", currentUser?.email)), (lists) => {
        if (lists.docChanges.length > 0 || dataToDisplay.length === 0)
            setDataToDisplay(lists.docs.map((item: DocumentData) => ({ id: item.id, ...item.data() })));
    });


    return (
        <section className="lists-list">
            {dataToDisplay.length > 0 ? dataToDisplay.sort((a, b) => a.createdTime < b.createdTime ? 1 : -1).map((item) => <ListsListBlock id={item.id} key={item.id} />) : <NothingHere />}
        </section>
    )
}

export default ListsList;