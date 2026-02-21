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

        /* 1. start uploading this task */
        /* 2. when uploading finishes remove task from active map */
        /* 3. again call process() to start next task */

        task.uploadFile().finally(() => {
            this.active.delete(taskID);
            this.process();
        })
    }

}