"use client";

import { useState, useEffect, useCallback } from "react";

import UserMenu from "@/components/UserMenu";
import MediaGrid from "@/components/MediaGrid";
import TabSelector from "@/components/TabSelector";
import Pagination from "@/components/Pagination";
import SearchBar from "@/components/SearchBar";
import { mediaService, MediaResponse } from "@/services/media.service";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"video" | "image">("image");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [mediaData, setMediaData] = useState<MediaResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchMedia = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await mediaService.getAll({
        type: activeTab,
        page: currentPage,
        search: searchTerm,
      });
      setMediaData(response);
    } catch (err: any) {
      setError(err.message);
      console.error("Error fetching media:", err);
    } finally {
      setLoading(false);
    }
  }, [activeTab, currentPage, searchTerm]);

  useEffect(() => {
    if (!mounted) return;
    fetchMedia();
  }, [mounted, fetchMedia]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleTabChange = (tab: "video" | "image") => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSearchTerm(""); // Clear search when changing tabs
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 max-w-7xl mx-auto">
      <div className="min-h-screen relative">
        <div className="absolute top-4 right-4">
          <UserMenu />
        </div>

        <div className="p-8">
          <h1 className="text-2xl font-bold mb-8">Welcome to Dashboard</h1>

          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <TabSelector
                activeTab={activeTab}
                onTabChange={handleTabChange}
              />
              <div className="w-64">
                <SearchBar
                  onSearch={handleSearch}
                  placeholder={`Search ${activeTab}s...`}
                />
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="text-red-500 text-center p-4">{error}</div>
            ) : mediaData ? (
              <>
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>
                    Total {activeTab}s:{" "}
                    {activeTab === "image"
                      ? mediaData.stats.totalImages
                      : mediaData.stats.totalVideos}
                  </span>
                  {searchTerm && (
                    <span>Search results for: "{searchTerm}"</span>
                  )}
                </div>

                <MediaGrid items={mediaData.data} type={activeTab} />

                {mediaData.pagination.totalPages > 1 && (
                  <Pagination
                    currentPage={mediaData.pagination.page}
                    totalPages={mediaData.pagination.totalPages}
                    onPageChange={setCurrentPage}
                  />
                )}
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
