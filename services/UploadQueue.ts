import { setUploadProgress, uploadingProgress } from '@/lib/redux/slice/fileUploadProgressSlice';
import { store } from '@/lib/redux/store';
import { v4 as uuidv4 } from 'uuid';

export class UploadQueue {

    waitingQueue: any = [];
    active = new Map();
    CONCURRENT: number = 3;



    addTask(task: any) {
        this.waitingQueue.push(task);
        this.process();
    }

    process() {
        while (this.waitingQueue.length > 0 && this.active.size < this.CONCURRENT) {
            const task = this.waitingQueue.shift();
            this.startTask(task);
        }
    }

    startTask(task: any) {
        const taskID = uuidv4();
        this.active.set(taskID, task);

        console.log('queue', this.waitingQueue, 'activeMap', this.active);

        task.addEventListener("progress", (event: any) => {
            console.log("progress", event.detail)
            const payload: uploadingProgress = {
                fileID: event.detail.fileID,
                fileName: event.detail.fileName,
                uploadedBytes: event.detail.uploadedBytes,
                totalSize: event.detail.totalSize,
                tempFileID: event.detail.tempFileID,
                status: 'uploading'
            }
            store.dispatch(setUploadProgress(payload))
        })

        task.addEventListener("completed", (event: any) => {
            console.log("completed", event.detail)
            const payload: uploadingProgress = {
                fileID: event.detail.fileID,
                fileName: event.detail.fileName,
                uploadedBytes: event.detail.uploadedBytes,
                totalSize: event.detail.totalSize,
                tempFileID: event.detail.tempFileID,
                status: 'completed'
            }
            store.dispatch(setUploadProgress(payload))
        })

        task.addEventListener("initiate", (event: any) => {
            console.log("initiate", event.detail)
            const payload: uploadingProgress = {
                fileID: event.detail.fileID,
                fileName: event.detail.fileName,
                uploadedBytes: event.detail.uploadedBytes,
                totalSize: event.detail.totalSize,
                tempFileID: event.detail.tempFileID,
                status: "hashing"
            }
            store.dispatch(setUploadProgress(payload))
        })

        task.addEventListener("aborted", (event: any) => {
            console.log("aborted", event.detail)
            const payload: uploadingProgress = {
                fileID: event.detail.fileID,
                fileName: event.detail.fileName,
                uploadedBytes: event.detail.uploadedBytes,
                totalSize: event.detail.totalSize,
                tempFileID: event.detail.tempFileID,
                status: "aborted"
            }
            store.dispatch(setUploadProgress(payload))
        })




        /* 1. start uploading this task */
        /* 2. when uploading finishes remove task from active map */
        /* 3. again call process() to start next task */

        task.startUpload().finally(() => {
            this.active.delete(taskID);
            this.process();
        })
    }

}