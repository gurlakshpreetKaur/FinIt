interface taskField {
    task: string,
    finished: boolean,
    createdAt: number,
    checkedAt?: number
    // taskID: string
}

interface listDocument {
    id: string,
    createdAt: string,
    createdOn: string,
    listKey?: string,
    ownedBy: string,
    tasks: { [index: string]: taskField },
    title: string,
    usedBy: string[]
}

function filterObject(object: { [index: string]: any }, fn: (key: string, value: any) => boolean): { [index: string]: any } {
    const res: { [index: string]: any } = {};
    for (let key in object) {
        if (fn(object[key], key)) {
            res[key] = object[key];
        }
    }
    return res;
}

export { type listDocument, type taskField, filterObject };