import { fileMetaData, renameResponse } from "@/types/response";
import React, { useEffect, useRef, useState, useCallback } from "react";
import FileCard from "../file/FileCard";
import { fetchFiles } from "@/functions/file/fetchFolderFiles";
import { api } from "@/lib/api";
import FileCardSkeleton from "../drive/FileCardSkeleton";

interface fileProp {
  parentID: string | null;
  fileResponse: fileMetaData[];
  fileRenameResponse: renameResponse[];
  fileType: string;
}

const FileContainer: React.FC<fileProp> = ({
  parentID,
  fileResponse,
  fileRenameResponse,
  fileType
}) => {
  const [files, setFiles] = useState<fileMetaData[]>([]);
  const [fileLoading, setFileLoading] = useState<boolean>(false); // Start false
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [limit] = useState<number>(8);

  const loadRef = useRef(null);
  const initialFetchDone = useRef(false);
  const isFetching = useRef(false); // Prevent multiple simultaneous requests
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Initial fetch
  useEffect(() => {
    const loadInitialFiles = async () => {
      setInitialLoading(true);
      setFiles([]);
      setCursor(null);
      setHasMore(true);
      initialFetchDone.current = false;
      isFetching.current = false;

      try {
        const parentIDParam = parentID === null ? 'null' : parentID;
        const url = `/user/files?parentID=${parentIDParam}&limit=${limit}&type=${fileType}`;
        const response = await api.get(url);

        setFiles(response.data.output);
        const nextCursor = response.data.nextCoursor;
        setCursor(nextCursor);
        setHasMore(!!nextCursor); // Has more if cursor exists
        initialFetchDone.current = true;
      } catch (error) {
        console.log("error fetching initial files", error);
      } finally {
        setInitialLoading(false);
      }
    };

    loadInitialFiles();

    // Cleanup observer on unmount or parentID change
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [parentID, limit, fileType]);

  // Handle new file creation
  useEffect(() => {
    if (fileResponse[0]?._id && fileResponse[0]?.parentID === parentID) {
      const exists = files.some(file => file._id === fileResponse[0]._id);
      if (!exists) {
        setFiles((prev) => [fileResponse[0], ...prev]);
      }
    }
  }, [fileResponse, parentID, files]);

  // Handle file rename - optimized with useCallback
  useEffect(() => {
    const rename = fileRenameResponse[0];
    if (rename?._id && rename.parentID === parentID) {
      setFiles((prev) =>
        prev.map((file) =>
          file._id === rename._id ? { ...file, filename: rename.filename } : file
        )
      );
    }
  }, [fileRenameResponse, parentID]);

  // Load more files - with proper locking mechanism
  const loadMoreFiles = useCallback(async () => {
    // Prevent multiple simultaneous requests
    if (isFetching.current || fileLoading || !hasMore || !cursor) {
      return;
    }

    isFetching.current = true;
    setFileLoading(true);

    try {
      await fetchFiles(parentID, setFiles, setFileLoading, setCursor, cursor, limit, fileType);

      // Update hasMore based on new cursor
      setHasMore(prevHasMore => {
        // This will be updated after fetchFiles completes
        return true;
      });
    } catch (error) {
      console.error("Error loading more files:", error);
    } finally {
      isFetching.current = false;
      setFileLoading(false);
    }
  }, [cursor, fileLoading, hasMore, parentID, limit, fileType]);

  // Setup intersection observer - optimized
  useEffect(() => {
    if (!loadRef.current || !hasMore || initialLoading) {
      return;
    }

    // Cleanup previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Create new observer with optimized settings
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        // Only trigger if intersecting, not loading, has more data, and not currently fetching
        if (target.isIntersecting && !fileLoading && hasMore && !isFetching.current && cursor) {
          loadMoreFiles();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '200px',
        root: null
      }
    );

    observerRef.current.observe(loadRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMoreFiles, fileLoading, hasMore, cursor, initialLoading]);

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
          <div className="col-span-full flex flex-col items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No files found</h3>
              <p className="mt-1 text-sm text-gray-500">Upload your first file to get started</p>
            </div>
          </div>
        )}
      </div>

      {/* Loading indicator - only show when loading more */}
      {fileLoading && !initialLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
          {[...Array(4)].map((_, i) => (
            <FileCardSkeleton key={`loading-more-${i}`} />
          ))}
        </div>
      )}

      {/* Intersection observer target - only show if there's more data */}
      {hasMore && cursor && files.length > 0 && !initialLoading && (
        <div ref={loadRef} className="h-10" />
      )}

      {/* End of content message */}
      {!hasMore && files.length > 0 && !fileLoading && (
        <div className="text-center py-8 text-gray-500 text-sm">
          You've reached the end
        </div>
      )}
    </div>
  );
};

export default FileContainer;