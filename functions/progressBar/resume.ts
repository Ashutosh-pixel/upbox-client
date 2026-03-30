import { uploadManager } from "@/services/UploadManager";

export function resume(tempFileID: string) {
    uploadManager.queue.resumeTask(tempFileID);
}