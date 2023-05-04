import React, { FC, useState, useContext, useEffect } from "react";
import "./AddList.css";
import { BottomContext, NavigationContext } from "../../App/App";
import { getDoc, doc, DocumentData, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { auth, db } from "../../../firebase-config";
import { listDocument } from "../../../interfacesAndUtil";
import date from "date-and-time";
import { useAuthState } from "react-firebase-hooks/auth";
import { customAlphabet } from "nanoid";

const AddList: FC = (): JSX.Element => {
    const [currentUser] = useAuthState(auth);

    const setBottomText = useContext(BottomContext);
    const { setCurrentPage } = useContext(NavigationContext);

    const [showTitleInput, setShowTitleInput] = useState(false);
    const [titleOrCode, setTitleOrCode] = useState("");
    const [password, setPassword] = useState("");
    const [showCreateNewList, setShowCreateNewList] = useState(true);
    const [showListCodeInput, setShowListCodeInput] = useState(false);
    const [showEnterListCode, setShowEnterListCode] = useState(true);
    const [isDisabled, setIsDisabled] = useState(false);

    useEffect(() => {
        if (showCreateNewList && showEnterListCode) {
            setBottomText("Choose an option :)");
            return;
        }
        if (showEnterListCode) {
            if (titleOrCode.length !== 20) {
                setBottomText("List code must have 20 characters, yours has " + (titleOrCode.length as unknown as string) + ".");
            } else {
                (async () => {
                    const result: DocumentData = await getDoc(doc(db, "lists", titleOrCode));
                    const resultExists = result.exists();
                    const resultData: listDocument = result.data();
                    if (!resultExists) {
                        setBottomText("No list with this code exists.");
                        return;
                    }
                    if (resultData.listKey && password === "") {
                        setBottomText("This list has a list key, please enter the list key");
                        setIsDisabled(true);
                        return;
                    }
                    if (!currentUser?.email) return;
                    if (resultData.usedBy.includes(currentUser?.email)) {
                        setBottomText("You already have access to this list :)");
                        return;
                    }
                    setBottomText("");
                    setIsDisabled(false);
                })();
            }
            return;
        }
        //this means create new list is selected
        if (titleOrCode.length === 0) {
            setIsDisabled(true);
            setBottomText("Enter a title for your new list.");
        } else if (password.length === 0) {
            setIsDisabled(false);
            setBottomText("Optionally, create a list key if you want to prevent your lists from being easily accessible by anyone.");
        } else {
            setIsDisabled(false);
            setBottomText("");
        }
    }, [titleOrCode, password]);

    useEffect(() => {
        return () => setBottomText("");
    }, []);

    const handleInitalButtonClickSetup = ({ target }: any): void => {
        const clickTarget: Element = target;
        const isClickEqualToCreateNewList: boolean = clickTarget.innerHTML === "Create New List";
        if (showEnterListCode && showCreateNewList) { //checking if either of the both buttons is hidden (to check if the setup is done)
            setShowTitleInput(isClickEqualToCreateNewList);
            setShowEnterListCode(!isClickEqualToCreateNewList);
            setShowCreateNewList(isClickEqualToCreateNewList);
            setShowListCodeInput(!isClickEqualToCreateNewList);
            if (isClickEqualToCreateNewList) setBottomText("Enter a title to for your new list.");
            else setBottomText("Enter your list code :)");
            setIsDisabled(true);
            return;
        }
        if (isClickEqualToCreateNewList) {
            const now = new Date();
            if (!currentUser) {
                setBottomText("There was an error with your authentication. Please try again.");
                return;
            }
            setIsDisabled(true);
            setBottomText("Processing...");
            const newList: listDocument = {
                id: customAlphabet("abcdefghijklmnopqrstuvwxABCDEFGHIJKLMNOPQRSTUVWXYZ", 20)(),
                createdAt: date.format(now, "HH:mm"),
                createdOn: date.format(now, "DD/MM/YYYY"),
                createdTime: now.getTime(),
                ...(password.length > 0 && { listKey: password }), //conditionally adding list key if user has entered a list key
                ownedBy: (currentUser?.email)!,
                tasks: {},
                title: titleOrCode,
                usedBy: [currentUser?.email!],
            };
            (async () => {
                await setDoc(doc(db, "lists", newList.id), (({ id, ...obj }) => obj)(newList));
                setCurrentPage(["view-list", newList.id]);
            })();
            setIsDisabled(false);
            return;
        }
        setIsDisabled(true);
        (async () => {
            const listData: listDocument = (await getDoc(doc(db, "lists", titleOrCode))).data() as listDocument;
            const listKey = listData.listKey;
            if (listKey !== "" && listKey !== undefined && listKey !== null && password !== listKey) {
                setBottomText("Incorrect list key :(");
            } else {
                await updateDoc(doc(db, "lists", titleOrCode), { usedBy: arrayUnion(currentUser?.email) });
                setCurrentPage(["view-list", titleOrCode]);
                setIsDisabled(false);
            }

        })();

    }
    return (
        <section className="add-list centered">
            {(!showCreateNewList || !showEnterListCode) &&
                <>
                    <input type="text" onChange={({ target }) => setTitleOrCode(target.value)} placeholder={showCreateNewList ? "Enter a title for your list..." : "Enter the list code..."} maxLength={20} required />
                    <input type="text" onChange={({ target }) => setPassword(target.value)} placeholder={showCreateNewList ? "Create a list key (optional)..." : "Enter the list key (if any)..."} maxLength={72} required />
                </>
            }
            {showCreateNewList && <button className="beaver-border solid-border mid-border" onClick={handleInitalButtonClickSetup} disabled={isDisabled}>Create New List</button>}
            {showEnterListCode && <button className="beaver-border solid-border mid-border" onClick={handleInitalButtonClickSetup} disabled={isDisabled}>Enter List Code</button>}
        </section>
    )
}

export default AddList;