import React, { FC, useState } from "react";
import "./ListsListBlock.css";
import { db, useDocumentData } from "../../../firebase-config";
import { doc } from "firebase/firestore";
import { listDocument } from "../../../interfacesAndUtil";

interface ListsListBlockProps {
    id: string
}

function ListsListBlock(props: ListsListBlockProps): JSX.Element {

    const [listData, listDataError] = useDocumentData<listDocument>(doc(db, "lists", props.id));
    const completedTasks = (listData.tasks ? (listData.tasks.length > 0 ? listData.tasks.filter(item => item.finished).length : "-") : "-") as unknown as string;
    const totalTasks = (listData.tasks ? (listData.tasks.length > 0 ? listData.tasks.length : "-") : "-") as unknown as string;
    const displayTasksCompleted = completedTasks + " / " + totalTasks;
    return (listData.tasks && <div className="lists-list-block semi-transparent-white-bg rounded">
        <p title={listData.title}>{listData.title}</p>
        <div className="grid-2">

            <div>
                <p title={displayTasksCompleted + " Tasks Completed"}>✔️{displayTasksCompleted}</p>
                <br />
                <p title={"Owned By " + listData.ownedBy}>🐨{listData.ownedBy}</p>
            </div>
            <div>
                <p title={"Created At " + listData.createdAt}>🕜{listData.createdAt}</p>
                <br />
                <p title={"Created On " + listData.createdOn}>📆{listData.createdOn}</p>
            </div>
        </div>

    </div>)
}

export default ListsListBlock;