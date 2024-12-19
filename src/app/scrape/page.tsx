"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { scrapeService } from "@/services/scrape.service";

interface JobStatus {
  id: string;
  status: "queued" | "active" | "completed" | "failed";
}

export default function ScrapePage() {
  const router = useRouter();
  const [urls, setUrls] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [activeJobs, setActiveJobs] = useState<JobStatus[]>([]);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(
    null
  );

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);

  const startPolling = useCallback((jobIds: string[]) => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
    }

    const interval = setInterval(async () => {
      try {
        const response = await scrapeService.checkJobStatus(jobIds);
        setActiveJobs(response.jobs);

        // Check if all jobs are completed or failed
        const allFinished = response.jobs.every(
          (job) => job.status === "completed" || job.status === "failed"
        );

        if (allFinished) {
          clearInterval(interval);
          setPollingInterval(null);

          // Check if all jobs completed successfully
          const allSuccessful = response.jobs.every(
            (job) => job.status === "completed"
          );
          if (allSuccessful) {
            setSuccess(true);
            setUrls("");
          } else {
            setError("Some jobs failed to complete");
          }
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 5000); // Poll every 5 seconds

    setPollingInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    setActiveJobs([]);

    try {
      const urlArray = urls
        .split("\n")
        .map((url) => url.trim())
        .filter((url) => url.length > 0);

      if (urlArray.length === 0) {
        throw new Error("Please enter at least one URL");
      }

      const response = await scrapeService.scrapeMedia(urlArray);

      if (response.data.status === "queued") {
        setActiveJobs(
          response.data.jobIds.map((id) => ({ id, status: "queued" }))
        );
        startPolling(response.data.jobIds);
      }
    } catch (err: any) {
      setError(err.message || "Failed to scrape URLs");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-yellow-600 bg-yellow-50";
      case "completed":
        return "text-green-600 bg-green-50";
      case "failed":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="min-h-screen p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">Scrape Media from URLs</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="urls"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Enter URLs (one per line)
          </label>
          <textarea
            id="urls"
            rows={10}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={urls}
            onChange={(e) => setUrls(e.target.value)}
            placeholder="https://example1.com&#10;https://example2.com&#10;https://example3.com"
            disabled={loading || activeJobs.length > 0}
          />
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {success && (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-600">All jobs completed successfully!</p>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => router.push("/")}
                className="px-6 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              >
                Back to Home
              </button>

              <button
                type="button"
                onClick={() => {
                  setUrls("");
                  setSuccess(false);
                  setActiveJobs([]);
                }}
                className="px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
              >
                Scrape More URLs
              </button>
            </div>
          </div>
        )}

        {activeJobs.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-medium">Job Status:</h3>
            {activeJobs.map((job) => (
              <div
                key={job.id}
                className={`p-3 rounded-lg border ${getStatusColor(
                  job.status
                )}`}
              >
                <div className="flex items-center gap-2">
                  {job.status === "active" && (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  )}
                  <span>
                    Job {job.id}: {job.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={loading || !urls.trim() || activeJobs.length > 0}
            className={`px-6 py-2 rounded-lg text-white font-medium
              ${
                loading || !urls.trim() || activeJobs.length > 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processing...</span>
              </div>
            ) : (
              "Start Scraping"
            )}
          </button>

          {urls.trim() && !loading && activeJobs.length === 0 && !success && (
            <button
              type="button"
              onClick={() => setUrls("")}
              className="px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
            >
              Clear
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
