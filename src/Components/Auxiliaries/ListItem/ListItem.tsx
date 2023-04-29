import React, { useState } from "react";
import "./ListItem.css";
// import { finished } from "stream";
import { listDocument, taskField, filterObject } from "../../../interfacesAndUtil";
import { arrayRemove, arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase-config";

interface ListItemProps {
    task: taskField,
    docID: string,
    taskID: string
}

function ListItem(props: ListItemProps) {
    const toCheck = "⬜";
    const doneTask = "✔️";
    const [listIcon, setListIcon] = useState<"⬜" | "✔️">(props.task.finished ? "✔️" : "⬜");
    const [taskClassName, setTaskClassName] = useState(props.task.finished ? "done-task" : "");
    const [editable, setEditable] = useState(false);
    const [editableTaskInput, setEditableTaskInput] = useState(props.task.task);

    const handleCheck = async () => {
        console.log("WILL UPDATE", props.task.task);
        if (listIcon === "⬜") {
            setListIcon("✔️");
            setTaskClassName("done-task");
            const taskLocation = "tasks." + props.taskID;

            await updateDoc(doc(db, "lists", props.docID), { [taskLocation + ".finished"]: true, [taskLocation + ".checkedAt"]: new Date().getTime() });
        } else {
            setListIcon("⬜");
            setTaskClassName("");
            const taskLocation = "tasks." + props.taskID;
            await updateDoc(doc(db, "lists", props.docID), { [taskLocation + ".finished"]: false, [taskLocation + ".checkedAt"]: -1 })
        }
    }
    return (
        <div className="list-item show-on-hover-parent">
            {/* <input type="checkbox" checked={!props.finished} /> */}
            <span className="not-pointy" title={props.task.task}>
                <span onClick={handleCheck}>{listIcon}</span>
                <p className={taskClassName}>{props.task.task}</p>
            </span>
            <span className="show-on-hover right-force">
                <span onClick={async () => {
                    const res: listDocument = (await getDoc(doc(db, "lists", props.docID))).data() as listDocument;
                    const latestList: { [index: string]: any } = {};
                    Object.keys(res.tasks).filter(item => item !== props.taskID).forEach((item) => {
                        latestList[item] = res.tasks[item];
                    });
                    console.log(JSON.stringify(latestList));
                    await updateDoc(doc(db, "lists", props.docID), { tasks: latestList });
                }}>🚮</span>

            </span>
        </div>
    )
}

export default ListItem;