import { uploadingProgress } from "@/lib/redux/slice/fileUploadProgressSlice";
import { RootState } from "@/lib/redux/store";
import { useSelector } from "react-redux";
import { CircularProgressWithLabel } from "../fileupload/CircularProgressWithLabel";

const ProgressBar = () => {

    const uploadProgress: uploadingProgress[] = useSelector((state: RootState) => state.fileUploadProgress);

    return (
        uploadProgress.map((progress: uploadingProgress) => {
            return <div key={progress.fileID}>
                <div>{progress.fileName}</div>
                <div><CircularProgressWithLabel value={progress?.totalSize ? Math.round((progress.uploadedBytes / progress.totalSize) * 100) : 0} /></div>
            </div>
        })
    )
}

export default ProgressBar;