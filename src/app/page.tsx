"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import UserMenu from "@/components/UserMenu";
import MediaGrid from "@/components/MediaGrid";
import TabSelector from "@/components/TabSelector";
import Pagination from "@/components/Pagination";
import {
  mediaService,
  MediaItem,
  MediaResponse,
} from "@/services/media.service";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"video" | "image">("image");
  const [currentPage, setCurrentPage] = useState(1);
  const [mediaData, setMediaData] = useState<MediaResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const fetchMedia = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await mediaService.getAll(activeTab, currentPage);
        setMediaData(response);
      } catch (err: any) {
        setError(err.message);
        console.error("Error fetching media:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, [activeTab, currentPage, mounted]);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const handleTabChange = (tab: "video" | "image") => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen p-8 max-w-7xl mx-auto">
      <div className="min-h-screen relative">
        <div className="absolute top-4 right-4">
          <UserMenu />
        </div>

        <div className="p-8">
          <h1 className="text-2xl font-bold">Welcome to Dashboard</h1>

          <TabSelector activeTab={activeTab} onTabChange={handleTabChange} />

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center p-4">{error}</div>
          ) : mediaData ? (
            <>
              <div className="mb-4 text-sm text-gray-600">
                Total {activeTab}s:{" "}
                {activeTab === "image"
                  ? mediaData.stats.totalImages
                  : mediaData.stats.totalVideos}
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
  );
}
