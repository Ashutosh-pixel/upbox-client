"use client";

import { useDebounce } from "@/functions/search/debounce";
import { globalSearch } from "@/functions/search/globalSearch";
import { searching } from "@/types/global";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Navbar = () => {
  const API_BASE_URL: string = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<searching[]>([]);
  const [searching, setSearching] = useState<boolean>(false);

  const ghostedText =
    searchQuery && searchResults && searchResults.length > 0
      ? searchResults[0].type === "folder"
        ? searchResults[0].name
        : searchResults[0].filename
      : "";
  const router = useRouter();

  const debounceQuery = useDebounce(searchQuery, 100);

  useEffect(() => {
    const search = async () => {
      if (debounceQuery.trim()) {
        await globalSearch(
          API_BASE_URL,
          debounceQuery,
          setSearchResults,
          setSearching,
        );
      }
    };
    search();
  }, [debounceQuery]);

  useEffect(() => {
    console.log("ghostedText", ghostedText);
  }, [ghostedText]);

  const resetSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setSearching(false);
  };

  return (
    <div className="navbar items-center h-14 flex w-full bg-white">
      <div className="searchbar border-2 items-center rounded-md flex relative w-80">
        {/* Ghost Text */}
        <div className="absolute top-0 left-0 m-1 ml-3 mr-3 pointer-events-none text-gray-400 whitespace-pre">
          {/*{searchQuery}  this is use to overlap*/}
          <span className="">{ghostedText?.toLowerCase()}</span>
        </div>

        {/* Real Input */}
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search..."
          className="relative z-10 focus:outline-none m-1 ml-3 mr-3 bg-transparent w-full"
        />

        {/* Search Icon */}
        <span className="m-1 ml-3 mr-3">
          <svg
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="24"
            viewBox="0 0 24 24"
          >
            <circle
              cx="11.7669"
              cy="11.7666"
              r="8.98856"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M18.0186 18.4851L21.5426 22"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </div>
      {searchResults &&
        searchResults.length > 0 &&
        searchResults.map((result, index) =>
          result.type === "file" ? (
            <div key={index}>{result.filename}</div>
          ) : (
            <div
              className=""
              onClick={() => {
                resetSearch();
                router.push(`image/${result._id}`);
              }}
              key={index}
            >
              {" "}
              {result.name}{" "}
            </div>
          ),
        )}
    </div>
  );
};

export default Navbar;
