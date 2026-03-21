import { uploadManager } from "@/services/UploadManager";

export function resume(fileID: string) {
    for (const file of uploadManager.queue.active) {
        if (file[1].fileID === fileID) {
            file[1].resumeUpload();
        }
    }
}