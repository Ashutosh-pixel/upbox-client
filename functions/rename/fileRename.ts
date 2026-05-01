// fileRename.tsx
import { api } from "@/lib/api";
import { Dispatch, SetStateAction } from "react";

export async function fileRename(
    newName: string,
    auto: boolean,
    userID: string,
    fileID: string,
    setNewName: Dispatch<SetStateAction<string>>,
    setIsLoading: Dispatch<SetStateAction<boolean>>,
    setErrorMessage: Dispatch<SetStateAction<string>>,
    setSuccessMessage: Dispatch<SetStateAction<string>>, // Add success message setter
    controller: AbortController
) {
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
        /* api call */
        await api.patch(`/user/file/fileRename`, { fileName: newName, autoRename: auto, userID: userID, fileID: fileID }, { signal: controller.signal })
        setNewName("");
        setSuccessMessage("File renamed successfully!"); // ADD THIS LINE

        setTimeout(() => {
            setSuccessMessage("");
        }, 3000);

        return true;

    } catch (error: any) {
        console.log("file rename failed", error)

        if (error.response.status === 400 && error.response.data.errorCode === "DETAILS_MISSING") {
            setErrorMessage("Try to Refresh")
        }
        else if (error.response.status === 404 && error.response.data.errorCode === "MISSING_FILE") {
            setErrorMessage("File not found")
        }
        else if (error.response.status === 409 && error.response.data.errorCode === "DUPLICATE_FILE") {
            setErrorMessage("Duplicate file detected")
        }

        return false; // ADD THIS LINE
    }
    finally {
        setIsLoading(false);
    }
}

export function cancelRename(
    setNewName: Dispatch<SetStateAction<string>>,
    setIsLoading: Dispatch<SetStateAction<boolean>>,
    setErrorMessage: Dispatch<SetStateAction<string>>,
    setSuccessMessage: Dispatch<SetStateAction<string>>,
    controller: AbortController
) {
    controller.abort();
    setNewName("");
    setIsLoading(false);
    setErrorMessage("");
    setSuccessMessage("");
}