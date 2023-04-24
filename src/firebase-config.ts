import { FirebaseApp, initializeApp } from "firebase/app";
import { getFirestore, Firestore, QuerySnapshot, DocumentData, Query, onSnapshot, DocumentReference } from "@firebase/firestore";
import { getAuth, Auth } from "@firebase/auth";
import { useState, useEffect, SetStateAction } from "react";

const firebaseConfig = {
    apiKey: "AIzaSyDaNNX_ViKwEOQQUwK5MTqvvv2vNRn4yII",
    authDomain: "finit-28be1.firebaseapp.com",
    projectId: "finit-28be1",
    storageBucket: "finit-28be1.appspot.com",
    messagingSenderId: "521970270192",
    appId: "1:521970270192:web:cb3aa44d72fd58331da735"
};

const app: FirebaseApp = initializeApp(firebaseConfig);

const db: Firestore = getFirestore(app);
const auth: Auth = getAuth(app);

const useDocument = (query: Query<DocumentData>): [QuerySnapshot<DocumentData> | undefined, {}] => {
    const [data, setData] = useState<QuerySnapshot<DocumentData>>();
    const [error, setError] = useState({});
    onSnapshot(query, (lists) => {
        if (lists.empty) {
            setError({ code: "no-lists-found", message: "No lists found that match the query." });
            return;
        }
        if (lists.docChanges.length === 0 && data !== undefined) return;
        setData(lists);
    });
    return [data, error];
}

const useDocumentData = <T = {}>(reference: DocumentReference): [T, {}] => {
    const [data, setData] = useState({});
    const [error, setError] = useState({});
    onSnapshot(reference, (list) => {
        if (!list.exists()) {
            setError({ code: "list-doesnt-exist", message: "No lists found with the given reference!" });
            return;
        }
        setData({ id: list.id, ...list.data() });
    });
    return [data as T, error];
}

const useDocumentsData = (query: Query<DocumentData>): [Array<{}>, {}] => {
    const [data, setData] = useState([{}]);
    const [error, setError] = useState({});
    onSnapshot(query, (lists) => {
        if (lists.empty) {
            setError({ code: "no-lists-found", message: "No lists found that match the query." });
            return;
        }
        const newData = lists.docs.map(item => ({ id: item.id, ...item.data() }));
        setData(newData);
    });
    return [data, error];
}

const useIDOfDocuments = (query: Query<DocumentData>): [string[], {}] => {
    const [listOfIDs, setListOfIDs] = useState<string[]>([]);
    const [error, setError] = useState({});
    onSnapshot(query, (lists) => {
        if (lists.empty) {
            setError({ code: "no-lists-found", message: "No lists found that match the query." });
            return;
        }
        const newData = lists.docs.map(item => item.id);
        setListOfIDs(newData);
    });
    return [listOfIDs, error];
}

export { db, auth, useDocumentData, useDocument, useDocumentsData, useIDOfDocuments };
