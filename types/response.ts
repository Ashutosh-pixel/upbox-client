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
    updatedAt: string
}