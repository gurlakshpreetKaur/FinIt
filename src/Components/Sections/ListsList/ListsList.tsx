import { query, collection, where } from "@firebase/firestore";
import React, { FC, useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
// import {Query} from "firebase/auth";
import { auth, db, useDocumentsData, useDocument, useIDOfDocuments } from "../../../firebase-config";
import ListsListBlock from "../../Auxiliaries/ListsListBlock/ListsListBlock";


function ListsList(): JSX.Element {
    const [currentUser] = useAuthState(auth);
    const [dataToDisplay, error] = useDocumentsData(query(collection(db, "lists"), where("ownedBy", "==", currentUser?.email)));
    const [ownedListsIDs, err] = useIDOfDocuments(query(collection(db, "lists"), where("ownedBy", "==", currentUser?.email)));

    return (
        <section className="lists-list">
            {ownedListsIDs.map((item) => <ListsListBlock id={item} key={item} />)}
            {ownedListsIDs.map((item) => <ListsListBlock id={item} key={item} />)}
            {ownedListsIDs.map((item) => <ListsListBlock id={item} key={item} />)}
            {/* {ownedListsIDs.map((item) => <ListsListBlock id={item} key={item} />)} */}
        </section>
    )
}

export default ListsList;