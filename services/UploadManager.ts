import { UploadQueue } from "./UploadQueue";

class UploadManager {
    queue = new UploadQueue();
}

export const uploadManager = new UploadManager();