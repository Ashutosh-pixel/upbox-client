import { uploadManager } from "@/services/UploadManager";

export function cancel(tempFileID: string) {
    uploadManager.queue.cancelTask(tempFileID);
}