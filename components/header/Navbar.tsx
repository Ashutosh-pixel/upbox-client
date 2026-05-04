"use client";

import { useDebounce } from "@/functions/search/debounce";
import { globalSearch } from "@/functions/search/globalSearch";
import { searching } from "@/types/global";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Search, X, Folder, File, Loader2 } from "lucide-react";

const Navbar = () => {
  const API_BASE_URL: string = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<searching[]>([]);
  const [searching, setSearching] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const router = useRouter();
  const pathname = usePathname();
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    const search = async () => {
      if (debounceQuery.trim()) {
        await globalSearch(
          API_BASE_URL,
          debounceQuery,
          setSearchResults,
          setSearching,
        );
        setShowDropdown(true);
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
    };
    search();
  }, [debounceQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResultClick = (result: searching) => {
    setSearchQuery("");
    setSearchResults([]);
    setShowDropdown(false);

    if (result.type === "folder") {
      // Navigate to folder based on current route type
      const currentPath = pathname;
      if (currentPath.includes('/image')) {
        router.push(`/drive/image/${result._id}`);
      } else if (currentPath.includes('/video')) {
        router.push(`/drive/video/${result._id}`);
      } else if (currentPath.includes('/document')) {
        router.push(`/drive/document/${result._id}`);
      } else {
        router.push(`/drive/${result._id}`);
      }
    } else {
      // For files
    }
  };

  return (
    <div className="navbar h-14 flex items-center px-6 bg-white border-b border-gray-100">
      <div className="relative w-96" ref={searchRef}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
            placeholder="Search files and folders..."
            className="w-full pl-9 pr-9 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:bg-white focus:ring-1 focus:ring-blue-400 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSearchResults([]);
                setShowDropdown(false);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {showDropdown && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50">
            {searching ? (
              <div className="flex items-center justify-center gap-2 p-4 text-sm text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Searching...</span>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="max-h-96 overflow-y-auto">
                {searchResults.map((result) => (
                  <button
                    key={result._id}
                    onClick={() => handleResultClick(result)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-100 last:border-b-0"
                  >
                    {result.type === "folder" ? (
                      <Folder className="w-4 h-4 text-blue-500" />
                    ) : (
                      <File className="w-4 h-4 text-gray-400" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {result.type === "folder" ? result.name : result.filename}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">
                        {result.type}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              debounceQuery && (
                <div className="p-4 text-center text-sm text-gray-500">
                  No results found for {debounceQuery}
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;