import { uploadManager } from "@/services/UploadManager";

export function pause(tempFileID: string) {
    uploadManager.queue.pauseTask(tempFileID);
}