import { ENDPOINTS } from "@/config/api";
import axiosInstance from "@/lib/axios";

export interface MediaItem {
  id: string;
  sourceUrl: string;
  type: "image" | "video";
  mediaUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationData {
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

export interface MediaResponse {
  data: MediaItem[];
  pagination: PaginationData;
  stats: {
    totalSources: number;
    totalImages: number;
    totalVideos: number;
  };
  filters: {
    type: string;
    search: string | null;
    dateRange: {
      start: string | null;
      end: string | null;
    };
  };
}

export const mediaService = {
  async getAll(type: "image" | "video", page = 1): Promise<MediaResponse> {
    try {
      const response = await axiosInstance.get(
        `${ENDPOINTS.MEDIA.GETALL}?type=${type}&page=${page}&limit=10`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || `Failed to fetch ${type}s`
      );
    }
  },
};
