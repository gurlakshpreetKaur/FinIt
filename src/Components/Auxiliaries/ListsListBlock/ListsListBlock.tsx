import React, { FC, useState, useContext, useEffect } from "react";
import "./ListsListBlock.css";
import { db, useDocumentData } from "../../../firebase-config";
import { doc, updateDoc } from "firebase/firestore";
import { listDocument } from "../../../interfacesAndUtil";
import { NavigationContext } from "../../App/App";
import Modal from "../Modal/Modal";

interface ListsListBlockProps {
    id: string
}

function ListsListBlock(props: ListsListBlockProps): JSX.Element {
    // console.log(NavigationContext.Consumer);
    const { setCurrentPage } = useContext(NavigationContext);

    const [listData, listDataError] = useDocumentData<listDocument>(doc(db, "lists", props.id));

    const [showSettingsModal, setShowSettingsModal] = useState(false);

    const [listKeyInput, setListKeyInput] = useState("");

    useEffect(() => {
        (async () => await updateDoc(doc(db, "lists", props.id), { listKey: listKeyInput }))();
    }, [listKeyInput]);

    const completedTasks = (listData.tasks ? (Object.keys(listData.tasks).length > 0 ? Object.keys(listData.tasks).map(item => listData.tasks[item]).filter(item => item.finished).length : "-") : "-") as unknown as string;
    const totalTasks = (listData.tasks ? (Object.keys(listData.tasks).length > 0 ? Object.keys(listData.tasks).length : "-") : "-") as unknown as string;
    const displayTasksCompleted = completedTasks + " / " + totalTasks;
    return (listData.tasks &&
        <>
            {showSettingsModal && (<Modal visibiltyHandler={setShowSettingsModal} classNames="settings">
                <h2>Settings</h2>
                <br />
                <p className="flex-div">List Code: <input value={props.id} readOnly title={"List Code: " + props.id} /></p>
                <br />
                <p className="flex-div">List Key:
                    <input value={listKeyInput} onChange={(change) =>
                        setListKeyInput(change.target.value)
                    } title={"List Key:" + listKeyInput} /></p>
                <br />
                <button className="solid-border walnut-brown-border mid-border wheat-bg">Share</button>
                <button className="solid-border walnut-brown-border mid-border wheat-bg">Done</button>
                <button className="solid-border walnut-brown-border mid-border beaver-bg" title="Delete List">Delete</button>
            </Modal>)}
            <div className="lists-list-block semi-transparent-white-bg rounded" onClick={(e) =>
                setCurrentPage(["view-list", props.id])
            }>
                <div className="flex-div">
                    <h2 title={listData.title}>{listData.title}</h2>
                    <span>
                        <button className="small" onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setShowSettingsModal(prev => !prev);
                            console.log("click");
                        }}>⚙️</button>
                    </span>
                </div>
                {/* <br /> */}
                <div className="grid-2">
                    <div>
                        <p title={displayTasksCompleted + " Tasks Completed"}>✔️{displayTasksCompleted}</p>
                        <br />
                        <p title={"Owned By " + listData.ownedBy}>🐨{listData.ownedBy}</p>
                        <br />
                    </div>
                    <div>
                        <p title={"Created At " + listData.createdAt}>🕜{listData.createdAt}</p>
                        <br />
                        <p title={"Created On " + listData.createdOn}>📆{listData.createdOn}</p>
                        <br />
                    </div>
                </div>
            </div>
        </>)
}

export default ListsListBlock;