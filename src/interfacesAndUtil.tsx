interface listDocument {
    id: string,
    createdAt: string,
    createdOn: string,
    listKey?: string,
    ownedBy: string,
    tasks: { task: string, finished: boolean }[],
    title: string,
    usedBy: string[]
}

export { type listDocument };