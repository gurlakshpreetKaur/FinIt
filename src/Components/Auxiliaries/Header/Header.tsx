import React, { FC, useState, useContext } from "react";
import "./Header.css";
import { NavigationContext, BottomContext } from "../../App/App";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../../firebase-config";
import Modal from "../Modal/Modal";
import { collection, deleteDoc, getDocs, query, where, doc, updateDoc, arrayRemove } from "firebase/firestore";

const Header: FC = (): JSX.Element => {
    const [currentUser] = useAuthState(auth);
    const { handleNavigation, addListButtonClassList, currentPage, pageTitle } = useContext(NavigationContext);
    const setBottomText = useContext(BottomContext);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalPermittedToExist, setIsModalPermittedToExist] = useState(false);
    const [isDeletePostsModalPermittedToExist, setIsDeletePostsModalPermittedToExist] = useState(false);
    const [isDeletePostsModalVisible, setIsDeletePostsModalVisible] = useState(false);

    return (
        <>
            {isDeletePostsModalPermittedToExist &&
                <Modal isVisible={isDeletePostsModalVisible} visibiltyHandler={setIsDeletePostsModalVisible} existenceHandler={setIsDeletePostsModalPermittedToExist}>
                    <h2>Confirm Account Deletion</h2>
                    <p>Are you sure you want to delete all your list? The lists which have been shared with you will be lost. Those who have access to your lists will lose access to them too. This action is irreversible.</p>
                    <button className="dangerous solid-border mid-border" onClick={async () => {
                        if (!currentUser) return;
                        setBottomText("Processing...");
                        const res = await getDocs(query(collection(db, "lists"), where("usedBy", "array-contains", currentUser.email)));
                        for (let i = 0; i < res.docs.length; i++) {
                            await updateDoc(doc(db, "lists", res.docs[i].id), { usedBy: arrayRemove(currentUser.email) });
                        }
                        const ownedLists = await getDocs(query(collection(db, "lists"), where("ownedBy", "==", currentUser.email)));
                        for (let i = 0; i < ownedLists.docs.length; i++) {
                            await deleteDoc(doc(db, "lists", ownedLists.docs[i].id));
                        }
                        setIsDeletePostsModalVisible(false);
                        setBottomText("Deleted all lists.");
                    }}>Delete All Lists</button>
                </Modal>}
            {isModalPermittedToExist && <Modal isVisible={isModalVisible} visibiltyHandler={setIsModalVisible} existenceHandler={setIsModalPermittedToExist}>
                <h2>⚠️Settings</h2>
                <br />
                <button className="beaver-bg bistre-border solid-border mid-border" onClick={() => {
                    setBottomText("Logging out...");
                    setTimeout(() => {
                        auth.signOut();
                        setBottomText("");
                        setIsModalPermittedToExist(false);
                    }, 1500);
                }}>Log Out</button>
                <br />
                <button className="dangerous solid-border mid-border" onClick={() => {
                    setIsModalVisible(false);
                    setIsDeletePostsModalPermittedToExist(true);
                    setIsDeletePostsModalVisible(true);
                }}>Delete All Lists</button>
            </Modal>}
            <header>
                {currentUser && <button className={addListButtonClassList + " back-btn centered-horizontal"} onClick={handleNavigation}>
                    {currentPage[0] === "main" ? "+" : "<~"}
                </button>}
                <h1 className="centered bold" onClick={() => { }}>{pageTitle}</h1>
                {currentUser && <button className="small user-settings centered-horizontal pearl-bg" onClick={(e) => {
                    e.stopPropagation();
                    if (!isModalPermittedToExist) {
                        setIsModalPermittedToExist(true);
                        setIsModalVisible(true);
                    }
                }}>:)</button>}
            </header>
        </>
    )
}

export default Header;