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

export interface MediaParams {
  type: "image" | "video";
  page?: number;
  limit?: number;
  search?: string;
}

export interface MediaParams {
  type: "image" | "video";
  page?: number;
  search?: string;
}

export const mediaService = {
  async getAll(params: MediaParams): Promise<MediaResponse> {
    const { type } = params;
    try {
      const { page = 1, search = "" } = params;
      const limit = type === "image" ? 12 : 9;
      const queryParams = new URLSearchParams();
      queryParams.append("type", type);
      queryParams.append("page", page.toString());
      queryParams.append("limit", limit.toString());
      if (search) {
        queryParams.append("search", search);
      }
      const response = await axiosInstance.get(
        `${ENDPOINTS.MEDIA.GETALL}?${queryParams.toString()}`
      );
      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw new Error(error.response?.data?.message || `Failed to fetch`);
    }
  },
};
