export interface response {
    message: string,
    sessionId: string
}

export interface data {
    userId: string,
    secret: string
}

export interface imagemetadata {
    _id?: string,
    userID: string,
    filename: string,
    size: string,
    type: string,
    storagePath: string,
    uploadTime: string,
    updatedAt: string,
    parentID: string
}

export interface folder {
    _id: string,
    name: string,
    parentID: string,
    userID: string,
    storagePath: string,
    pathIds: [any],
    pathNames: [string],
    status: string,
    uploadTime: Date,
    updatedAt: Date
}

export interface fileMetaData {
    _id: string,
    userID: string,
    filename: string,
    size: number,
    type: string,
    storagePath: string,
    uploadTime: string,
    updatedAt: string,
    parentID: string
    sourcePath?: string
}