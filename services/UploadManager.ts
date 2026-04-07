import { UploadQueue } from "./UploadQueue";

class UploadManager {
    queue = new UploadQueue();
    globalDuplicateMap = new Map();
}

export const uploadManager = new UploadManager();