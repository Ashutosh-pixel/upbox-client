import { cancelRename, fileRename } from "@/functions/rename/fileRename";
import { useState } from "react";

type renameProps = {
    fileID: string;
}

const Rename = ({ fileID }: renameProps) => {
    const [newName, setNewName] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const userID = "681cbca24c31bfa9b698a961";
    const controller = new AbortController();


    return <div>
        <input type="text"
            value={newName}
            placeholder="Enter New Name"
            onChange={(e) => {
                setNewName(e.target.value)
                if (errorMessage) {
                    setErrorMessage("");
                }
            }}
        />

        <button disabled={isLoading} onClick={() => {
            const text = newName.trim();
            if (!text) {
                setErrorMessage("Name is required")
                return;
            }
            fileRename(newName, false, userID, fileID, setNewName, setIsLoading, setErrorMessage, controller);
        }}>Rename</button>
        {/* <button disabled={isLoading} onClick={() => fileRename(newName, true, setNewName, setIsLoading)}>Auto</button> */}
        <button disabled={isLoading} onClick={() => cancelRename(setNewName, setIsLoading, setErrorMessage, controller)}>Cancel</button>

        {errorMessage && <p className=" text-red-700">{errorMessage}</p>}


    </div>
}

export default Rename;