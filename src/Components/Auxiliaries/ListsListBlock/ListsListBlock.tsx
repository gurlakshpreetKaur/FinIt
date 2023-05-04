import React, { useState, useContext, useEffect } from "react";
import "./ListsListBlock.css";
import { auth, db } from "../../../firebase-config";
import { arrayRemove, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { listDocument } from "../../../interfacesAndUtil";
import { NavigationContext } from "../../App/App";
import { BottomContext } from "../../App/App";
import Modal from "../Modal/Modal";
import { useAuthState } from "react-firebase-hooks/auth";

interface ListsListBlockProps {
    list: listDocument
}

function ListsListBlock(props: ListsListBlockProps): JSX.Element {
    const [currentUser] = useAuthState(auth);

    const { setCurrentPage } = useContext(NavigationContext);
    const setBottomText = useContext(BottomContext);

    const { list } = props;

    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [permitShowSettingsModalToExist, setPermitShowSettingsModalToExist] = useState(false);

    const [showDeleteListModal, setShowDeleteListModal] = useState(false);
    const [permitDeleteListModalToExist, setPermitDeleteListModalToExist] = useState(false);

    const [listKeyInput, setListKeyInput] = useState(list.listKey);
    const [listTitleInput, setListTitleInput] = useState(list.title);

    useEffect(() => {
        if (listKeyInput !== list.listKey)
            (async () => await updateDoc(doc(db, "lists", list.id), { listKey: listKeyInput }))();
    }, [listKeyInput, list.id, list.listKey]);

    useEffect(() => {
        if (listTitleInput !== list.title)
            (async () => await updateDoc(doc(db, "lists", list.id), { title: listTitleInput }))();
    }, [listTitleInput, list.id, list.title]);

    const completedTasks = list && (list.tasks ? (Object.keys(list.tasks).length > 0 ? Object.keys(list.tasks).map(item => list.tasks[item]).filter(item => item.finished).length : "-") : "-") as unknown as string;
    const totalTasks = list && (list.tasks ? (Object.keys(list.tasks).length > 0 ? Object.keys(list.tasks).length : "-") : "-") as unknown as string;
    const displayTasksCompleted = list && (completedTasks + " / " + totalTasks);

    return (list && list.tasks &&
        <>
            {permitDeleteListModalToExist &&
                <Modal visibiltyHandler={setShowDeleteListModal} classNames="delete-list" isVisible={showDeleteListModal} existenceHandler={setPermitDeleteListModalToExist}>
                    {list.ownedBy === currentUser?.email ?
                        <>
                            <h2>Confirm List Deletion</h2>
                            <p>Are you sure you want to delete your list titled '{list.title}'? This action cannot be reversed. All people who use your list will also lose access to it.</p>
                            {/* <br /> */}
                            <button className="dangerous solid-border mid-border" title="Delete List" onClick={() => {
                                (async () =>
                                    await deleteDoc(doc(db, "lists", list.id))
                                )();
                                setTimeout(() => {
                                    setBottomText("Delete successful :)");
                                    setTimeout(() => setBottomText(""), 2500);
                                }, 10);
                            }}>Delete</button>
                        </> :
                        <>
                            <h2>Confirm List Removal</h2>
                            <p>Are you sure you want to remove your access to this list? This will delete the list from your notebook unless you add it again.</p>
                            <button className="dangerous solid-border mid-border" title="Remove List" onClick={() => {
                                (async () =>
                                    await updateDoc(doc(db, "lists", list.id), { usedBy: arrayRemove(currentUser?.email) })
                                )();
                                setTimeout(() => {
                                    setBottomText("Delete successful :)");
                                    setTimeout(() => setBottomText(""), 2500);
                                }, 10);
                            }}>Remove</button>
                        </>}
                </Modal>}
            {permitShowSettingsModalToExist &&
                <Modal visibiltyHandler={setShowSettingsModal} classNames="settings" isVisible={showSettingsModal} existenceHandler={setPermitShowSettingsModalToExist}>
                    <h2>Settings</h2>
                    <br />
                    <p className="flex-div">Title:
                        <input value={listTitleInput} onChange={(change) => change.target.value.length >= 1 && setListTitleInput(change.target.value)} title={"List Title: " + listTitleInput} placeholder="List Title..." maxLength={20} required />
                    </p>
                    <br />
                    <p className="flex-div">List Code: <input value={list.id} readOnly title={"List Code: " + list.id} /></p>
                    <br />
                    <p className="flex-div">List Key:
                        <input value={listKeyInput} onChange={(change) =>
                            setListKeyInput(change.target.value)
                        } title={"List Key:" + listKeyInput} placeholder="Optional List Key..." /></p>
                    <br />
                    <button className="solid-border bistre-border mid-border beaver-bg" onClick={() => {
                        setBottomText("Copied List Key and List Code!");
                        if (list.listKey === "" || list.listKey === undefined) navigator.clipboard.writeText("Hey! I use a Google Extention called FinIt to manage my to-do lists, here's the list code for my list titled '" + list.title + "': \n\n List Code: " + list.id + "\n\n Please check it out :)");
                        else navigator.clipboard.writeText("Hey! I use a Google Extention called FinIt to manage my to-do lists, here's the list code and list key to access my list titled '" + list.title + "': \n\n List Code: " + list.id + "\n\n List Key: " + list.listKey + ". \n\n Please check it out :)");
                    }}>Share</button>
                    <button className="dangerous solid-border mid-border" title="Delete List" onClick={() => {
                        setShowSettingsModal(false);
                        setPermitDeleteListModalToExist(true);
                        setShowDeleteListModal(true);
                    }}>Delete</button>
                    <br /><br />
                </Modal>}
            <div className="lists-list-block rounded" onClick={(e) =>
                setCurrentPage(["view-list", list.id])
            }>
                <div className="flex-div">
                    <h2 title={list.title}>{list.title}</h2>
                    <span>
                        <button className="small" onClick={(e) => {
                            e.stopPropagation();
                            if (!permitShowSettingsModalToExist) {
                                setPermitShowSettingsModalToExist(true);
                                setShowSettingsModal(true);
                            }
                        }} title="List Settings">⚙️</button>
                    </span>
                </div>
                {/* <br /> */}
                <div className="grid-2">
                    <div>
                        <p title={displayTasksCompleted + " Tasks Completed"}>✔️{displayTasksCompleted}</p>
                        <br />
                        <p title={"Owned By " + list.ownedBy}>{list.ownedBy}</p>
                        <br />
                    </div>
                    <div>
                        <p title={"Created At " + list.createdAt}>🕜{list.createdAt}</p>
                        <br />
                        <p title={"Created On " + list.createdOn}>📆{list.createdOn}</p>
                        <br />
                    </div>
                </div>
            </div>
        </>)
}

export default ListsListBlock;