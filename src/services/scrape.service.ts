import axiosInstance from "@/lib/axios";

export interface ScrapeResponse {
  success: boolean;
  message: string;
  data: {
    status: string;
    jobIds: string[];
    message: string;
    cachedResults: any[];
  };
}

export interface JobStatus {
  id: string;
  status: "active" | "completed" | "failed";
}

export interface JobStatusResponse {
  jobs: JobStatus[];
}

export const scrapeService = {
  async scrapeMedia(urls: string[]): Promise<ScrapeResponse> {
    try {
      const response = await axiosInstance.post("/api/scrape/scrape-media", {
        urls,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to process URLs. Please try again."
      );
    }
  },

  async checkJobStatus(jobIds: string[]): Promise<JobStatusResponse> {
    try {
      const response = await axiosInstance.get(
        `/api/scrape/status/${jobIds.join(",")}`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to check job status"
      );
    }
  },
};
