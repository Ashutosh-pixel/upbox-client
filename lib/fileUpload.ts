import axios from "axios";
import { createChunks } from "./utils";
import { Setter } from "@/types/upload";

export async function handleUploadFile(file: File, folderID: string, userID: string, parentID: string|null, pathIds: string[], pathNames: string[], storagePath: string, setUploadId: Setter<string[]>, setUploading: Setter<boolean>, setFileName: Setter<string[]>) {
  if (!file) return;
  try {
    setUploading(true);

    // Step:1 setup connection with s3 by backend server
    const fileName = file.name;
    const fileSize = file.size;
    const fileType = file.type;
    const chunkSize = 5 * 1024 * 1024;
    const { totalParts } = createChunks(file, chunkSize);

    const initRes = await axios.post("http://localhost:3001/user/uploadfile/initiate", {
      fileName,
      userID,
      fileSize,
      totalParts,
      chunkSize,
      fileType,
      parentID,
      pathIds,
      pathNames,
      storagePath
    });
    const uploadId = await initRes.data.uploadId;
    const fileID = await initRes.data.fileID;
    setUploadId((prev) => [...prev, uploadId]);
    setFileName((prev) => [...prev, fileName]);

    // Setp:2 split file into chunks
    const { chunks } = createChunks(file);
    const uploadParts = [];

    let i = 0;
    while (i < totalParts) {
      // TEMPORARY: Extra check to test the RESUME feature during development
      // if (i === 3) throw new Error("Simulated network failure");

      // Step:3 get presigned urls for each parts from backend server
      const res = await fetch(
        `http://localhost:3001/user/file/upload/url?fileName=${fileName}&uploadId=${uploadId}&storagePath=${storagePath}&partNumber=${i + 1}`,
      );
      const { url } = await res.json();


      // Step:4 upload chunks to s3
      const uploadRes = await axios.put(url, chunks[i]);

      const eTag = uploadRes.headers["etag"] || uploadRes.headers["Etag"];
      uploadParts.push({ PartNumber: i + 1, ETag: eTag });

      const uploadPartInfo = { PartNumber: i + 1, ETag: eTag };

      // Step:5 make a record in database
      await axios.post(
        "http://localhost:3001/user/file/uploadsession/uploadparts",
        { uploadPartInfo, userID, fileName, uploadId },
      );

      i++;
    }

    // Step:6 complete upload
    const finalRes = await axios.post(
      "http://localhost:3001/user/file/upload/complete",
      { uploadId, parts: uploadParts, storagePath, folderID, fileID },
    );
    if (finalRes.data.location) {
      // setFileName('');
      // setUploadId('');
    }
    alert(finalRes.data.message || finalRes.data.error);
  } catch (error) {
    console.log("error while uploading", error);
  } finally {
    setUploading(false);
  }
}
