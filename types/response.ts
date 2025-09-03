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
    uploadTime: string
}