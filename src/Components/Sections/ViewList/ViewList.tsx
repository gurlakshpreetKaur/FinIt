import { arrayUnion, doc } from "firebase/firestore";
import "./ViewList.css";
import React, { useState, useContext, useEffect } from "react";
import { db, useDocumentData } from "../../../firebase-config";
import { listDocument } from "../../../interfacesAndUtil";
import ListItem from "../../Auxiliaries/ListItem/ListItem";
import { updateDoc } from "firebase/firestore";
import { customAlphabet } from "nanoid";
import { NavigationContext } from "../../App/App";
import NothingHere from "../../Auxiliaries/NothingHere/NothingHere";

interface ViewListProps {
    id: string,
}

function ViewList(props: ViewListProps) {
    const { setPageTitle } = useContext(NavigationContext);
    const [listData] = useDocumentData<listDocument>(doc(db, "lists", props.id));
    const [taskInput, setTaskInput] = useState("");

    const sortingSystem = (a: string, b: string): -1 | 1 => {
        //if either one of them is checked, give higher prior to the checked task (appear first)
        if (listData.tasks[a].finished && !listData.tasks[b].finished) return -1;
        if (listData.tasks[b].finished && !listData.tasks[a].finished) return 1;
        //this means either both are checked, or both are unchecked
        //in which case, we shall check the date of creation, or the date of being checked to order them
        if (!listData.tasks[a].finished && !listData.tasks[b].finished) {
            if (listData.tasks[a].createdAt < listData.tasks[b].createdAt) return -1;
            return 1;
        }
        if (Boolean(listData.tasks[a].checkedAt) && Boolean(listData.tasks[b].checkedAt)) {
            if (listData.tasks[a].checkedAt! < listData.tasks[b].checkedAt!) return -1;
        }
        return 1;
    }

    useEffect(() => {
        if (listData.title) setPageTitle(listData.title);
    }, [listData]);

    return (<section className="view-list">

        <span className="not-pointy">🐨</span>
        <input className="invisible" placeholder="Add task..." value={taskInput} onChange={(change) => setTaskInput(change.target.value)} /><span onClick={async () => {
            await updateDoc(doc(db, "lists", props.id), { ["tasks." + customAlphabet("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", 20)()]: { task: taskInput.trim(), finished: false, createdAt: new Date().getTime() } });
            setTaskInput("");
        }}>✅</span>

        {listData.tasks ? (Object.keys(listData.tasks).length > 0 ? Object.keys(listData.tasks).sort(sortingSystem).map((item) => <ListItem task={listData.tasks[item]} docID={props.id} taskID={item} key={props.id + item} />) : <NothingHere />) : <NothingHere />}
    </section>);
}

export default ViewList;