import { uploadingProgress } from "@/lib/redux/slice/fileUploadProgressSlice";
import { RootState } from "@/lib/redux/store";
import { useSelector } from "react-redux";
import { CircularProgressWithLabel } from "../fileupload/CircularProgressWithLabel";
import { pause } from "@/functions/progressBar/pause";
import { resume } from "@/functions/progressBar/resume";
import { cancel } from "@/functions/progressBar/cancel";

const ProgressBar = () => {

    const uploadProgress: uploadingProgress[] = useSelector((state: RootState) => state.fileUploadProgress);

    return (
        uploadProgress.map((progress: uploadingProgress) => {
            return <div key={progress.fileID}>
                <div>{progress.fileName}</div>
                {progress.status !== 'completed' && <div><CircularProgressWithLabel value={progress?.totalSize ? Math.round((progress.uploadedBytes / progress.totalSize) * 100) : 0} /></div>}
                <button onClick={() => pause(progress.fileID)}>PAUSE</button>
                <button onClick={() => resume(progress.fileID)}>RESUME</button>
                <button onClick={() => cancel(progress.fileID)}>CANCEL</button>
            </div >
        })
    )
}

export default ProgressBar;