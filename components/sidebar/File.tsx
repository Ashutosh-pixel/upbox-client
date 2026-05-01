// FileContainer.tsx (Fixed - don't send "null" as string)
import { fileMetaData, renameResponse } from "@/types/response";
import React, { useEffect, useRef, useState, useCallback } from "react";
import FileCard from "../file/FileCard";
import { fetchFiles } from "@/functions/file/fetchFolderFiles";
import { api } from "@/lib/api";
import FileCardSkeleton from "../drive/FileCardSkeleton";

interface fileProp {
  parentID: string | null;
  fileResponse: fileMetaData[];
  fileRenameResponse: renameResponse[]
}

const FileContainer: React.FC<fileProp> = ({ parentID, fileResponse, fileRenameResponse }) => {
  const [files, setFiles] = useState<fileMetaData[]>([]);
  const [fileLoading, setFileLoading] = useState<boolean>(true);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [cursor, setCursor] = useState<string | null>(null); // Initialize as null, not ''
  const [limit, setLimit] = useState<number>(8);
  const loadRef = useRef(null);
  const initialFetchDone = useRef(false);

  // Initial fetch when component mounts or parentID changes
  useEffect(() => {
    const loadInitialFiles = async () => {
      setInitialLoading(true);
      setFileLoading(true);
      setFiles([]);
      setCursor(null); // Reset cursor to null
      initialFetchDone.current = false;

      try {
        // Fix: Don't send "null" as string, send actual null or don't include the param
        const parentIDParam = parentID === null ? 'null' : parentID;
        const url = `/user/files?parentID=${parentIDParam}&limit=${limit}`;
        // Remove cursor from initial request - don't send "null" as string
        const response = await api.get(url);
        setFiles(response.data.output);
        setCursor(response.data.nextCoursor);
        initialFetchDone.current = true;
      } catch (error) {
        console.log("error fetching initial files", error);
      } finally {
        setInitialLoading(false);
        setFileLoading(false);
      }
    };

    loadInitialFiles();
  }, [parentID]);

  // Handle new file creation (from upload)
  useEffect(() => {
    if (fileResponse[0]?._id && fileResponse[0]?.parentID === parentID) {
      const exists = files.some(file => file._id === fileResponse[0]._id);
      if (!exists) {
        setFiles((prev) => [fileResponse[0], ...prev]);
      }
    }
  }, [fileResponse, parentID]);

  // Handle file rename
  useEffect(() => {
    const rename = fileRenameResponse[0];
    if (rename?._id && rename.parentID === parentID) {
      setFiles((prev) =>
        prev.map((file) =>
          file._id === rename._id
            ? { ...file, filename: rename.filename }
            : file
        )
      );
    }
  }, [fileRenameResponse, parentID]);

  // Load more files when scrolling (infinite scroll)
  const loadMoreFiles = useCallback(() => {
    // Only load more if cursor exists (not null) and not loading
    if (cursor && !fileLoading && initialFetchDone.current) {
      fetchFiles(parentID, setFiles, setFileLoading, setCursor, cursor, limit);
    }
  }, [cursor, fileLoading, parentID, limit]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && cursor && !fileLoading) {
        loadMoreFiles();
      }
    }, { threshold: 0.1, rootMargin: '100px' });

    if (loadRef.current) observer.observe(loadRef.current);
    return () => observer.disconnect();
  }, [loadMoreFiles, cursor, fileLoading]);

  // Show shimmer loading for initial load
  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
          {[...Array(12)].map((_, i) => (
            <FileCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {files.length > 0 ? (
          files.map((fileMetadata) => (
            <FileCard key={fileMetadata._id} fileMetadata={fileMetadata} />
          ))
        ) : (
          !initialLoading && (
            <div className="col-span-full flex flex-col items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No files found</h3>
                <p className="mt-1 text-sm text-gray-500">Upload your first file to get started</p>
              </div>
            </div>
          )
        )}
      </div>

      {/* Loading more indicator */}
      {fileLoading && !initialLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
          {[...Array(4)].map((_, i) => (
            <FileCardSkeleton key={`loading-more-${i}`} />
          ))}
        </div>
      )}

      {/* Intersection observer target - only show if there's more data */}
      {cursor && files.length > 0 && (
        <div ref={loadRef} className="h-10" />
      )}

      {/* End of content message */}
      {!cursor && files.length > 0 && !fileLoading && (
        <div className="text-center py-8 text-gray-500 text-sm">
          You've reached the end
        </div>
      )}
    </div>
  );
};

export default FileContainer;