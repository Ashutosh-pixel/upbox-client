import { api } from "@/lib/api";
import { createChunks } from "@/lib/utils";
import { Setter } from "@/types/global";
import axios from "axios";

export async function resume(uploadId: string, fileName: string, fileID: string, file: File | null, setFileName: Setter<string>, setUploadId: Setter<string>) {
  if (uploadId && fileName && fileID) {
    try {
      // Step:1 setup connection with s3 by backend server
      const response = await api.post(
        `/user/file/resume/initiate`,
        { sessionID: uploadId, fileName },
      );
      const chunkSize = response.data.output.chunkSize;
      const uploadParts = response.data.output.uploadParts;
      const storagePath = response.data.storagePath;

      if (file) {
        // Setp:2 split file into chunks
        const { chunks, totalParts } = createChunks(file, chunkSize);
        const uploadedSet = new Set(
          uploadParts.map((p: { PartNumber: any }) => p.PartNumber),
        );

        for (let i = 1; i <= totalParts; i++) {
          if (uploadedSet.has(i)) {
            continue;
          }

          // Step:3 get presigned urls for each parts from backend server
          const res = await fetch(
            `/user/file/upload/url?fileName=${fileName}&uploadId=${uploadId}&storagePath=${storagePath}&partNumber=${i}`,
          );
          const { url } = await res.json();

          // Step:4 upload chunks to s3
          const uploadRes = await api.put(url, chunks[i - 1]);

          const eTag = uploadRes.headers["etag"] || uploadRes.headers["Etag"];
          uploadParts.push({ PartNumber: i, ETag: eTag });

          const uploadPartInfo = { PartNumber: i, ETag: eTag };

          // Step:5 make a record in database
          await api.post(
            `/user/file/uploadsession/uploadparts`,
            { uploadPartInfo, fileName, uploadId },
          );

          uploadedSet.add(i);
        }
      }

      // Step:6 complete upload
      const finalRes = await api.post(
        `/user/file/upload/complete`,
        { uploadId, parts: uploadParts, storagePath, fileID },
      );
      if (finalRes.data.location) {
        setFileName("");
        setUploadId("");
      }
      alert(finalRes.data.message || finalRes.data.error);
    } catch (error) {
      console.log("error while uploading", error);
    }
  }
}