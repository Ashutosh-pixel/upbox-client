import { setUploadProgress } from "@/lib/redux/slice/fileUploadProgressSlice";
import { store } from "@/lib/redux/store";
import { v4 as uuidv4 } from 'uuid';

export class UploadQueue {
    waitingQueue: any[] = [];
    pauseQueue: any[] = [];
    active = new Map<string, any>();
    tempToTaskMap = new Map<string, string>();
    CONCURRENT: number = 3;

    addTask(task: any) {
        task.status = "waiting";
        this.waitingQueue.push(task);
        this.process();
    }

    process() {
        // 1. Cleanup: Remove tasks that are no longer "active"
        for (const [taskID, task] of this.active.entries()) {
            if (task.status === 'completed' || task.status === 'aborted' || task.isPaused) {
                this.active.delete(taskID);
            }
        }

        // 2. Fill slots while we have space and tasks waiting
        while (this.active.size < this.CONCURRENT && this.waitingQueue.length > 0) {
            const task = this.waitingQueue.shift();
            this.runTask(task);
        }
    }

    private runTask(task: any) {
        // Ensure task has an ID and is tracked
        if (!task.taskID) {
            task.taskID = uuidv4();
            this.tempToTaskMap.set(task.tempFileID, task.taskID);
            this.attachListeners(task); // Attach Redux listeners ONLY ONCE
        }

        this.active.set(task.taskID, task);

        // Choose the correct method based on state
        const action = task.isPaused ? task.resumeUpload() : task.startUpload();

        // The Critical Fix: Resumed tasks MUST call process() when finished
        action
            .catch((err: any) => console.error("Task Error:", err))
            .finally(() => {
                // If the user didn't manually pause it, remove it and move to next
                if (!task.isPaused) {
                    this.active.delete(task.taskID);
                    this.process();
                }
            });
    }

    resumeTask(tempFileID: string) {
        const taskID = this.tempToTaskMap.get(tempFileID);
        if (!taskID) return;

        const index = this.pauseQueue.findIndex(t => t.taskID === taskID);
        if (index === -1) return;

        const task = this.pauseQueue.splice(index, 1)[0];

        // Move to front of line
        this.waitingQueue.unshift(task);

        // This now ONLY updates the status label in UI. 
        // The progress bar stays at its last percentage!
        store.dispatch(setUploadProgress({
            tempFileID: task.tempFileID,
            status: 'waiting'
        }));

        this.process();
    }

    pauseTask(tempFileID: string) {
        const taskID = this.tempToTaskMap.get(tempFileID);

        // FIX: Guard clause to handle 'undefined'
        if (!taskID) {
            console.warn(`No taskID found for tempFileID: ${tempFileID}`);
            return;
        }

        const task = this.active.get(taskID);
        if (task) {
            task.pauseUpload();
            this.active.delete(taskID);
            this.pauseQueue.push(task);
            this.process();
        }
    }

    cancelTask(tempFileID: string) {
        const taskID = this.tempToTaskMap.get(tempFileID);
        if (!taskID) return;

        // 1. Check if it's in the Active Map
        const activeTask = this.active.get(taskID);
        if (activeTask) {
            activeTask.abortUpload();
            this.active.delete(taskID);
        }

        // 2. Check if it's in the Pause Queue
        const pauseIndex = this.pauseQueue.findIndex(t => t.taskID === taskID);
        if (pauseIndex !== -1) {
            const pausedTask = this.pauseQueue.splice(pauseIndex, 1)[0];
            pausedTask.abortUpload();
        }

        // 3. Check if it's in the Waiting Queue
        const waitIndex = this.waitingQueue.findIndex(t => t.taskID === taskID);
        if (waitIndex !== -1) {
            const waitingTask = this.waitingQueue.splice(waitIndex, 1)[0];
            waitingTask.abortUpload();
        }

        // 4. Cleanup Tracking Maps
        this.tempToTaskMap.delete(tempFileID);

        // 5. Update Redux (or clean it up entirely)
        store.dispatch(setUploadProgress({
            tempFileID: tempFileID,
            status: 'aborted'
        }));

        // 6. Crucial: Trigger process() to fill the newly opened slot
        this.process();

        console.log('CANCEL_COMPLETE', { tempFileID, active: this.active.size, waiting: this.waitingQueue.length });
    }

    // Move your event listeners here to keep runTask clean
    private attachListeners(task: any) {
        const events = ["progress", "completed", "initiate", "aborted", "paused", "resumed"];
        events.forEach(eventType => {
            task.addEventListener(eventType, (event: any) => {
                const statusMap: Record<string, string> = {
                    progress: 'uploading',
                    completed: 'completed',
                    initiate: 'hashing',
                    aborted: 'aborted',
                    paused: 'paused',
                    resumed: 'uploading'
                };

                store.dispatch(setUploadProgress({
                    ...event.detail,
                    status: statusMap[eventType]
                }));
            });
        });
    }
}