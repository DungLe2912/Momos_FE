import Image from "next/image";
import { MediaItem } from "@/services/media.service";

interface MediaGridProps {
  items: MediaItem[];
  type: "video" | "image";
}

export default function MediaGrid({ items, type }: MediaGridProps) {
  return (
    <div
      className={`grid gap-4 ${
        type === "video"
          ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      }`}
    >
      {items.map((item) => (
        <div
          key={item.id}
          className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          {type === "video" ? (
            <div className="aspect-video">
              <video className="w-full h-full object-cover rounded" controls>
                <source src={item.mediaUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          ) : (
            <div className="aspect-square">
              <Image
                src={item.mediaUrl}
                alt={item.sourceUrl}
                width={400}
                height={400}
                className="w-full h-full object-cover rounded"
              />
            </div>
          )}
          <div className="mt-2">
            <h3
              className="font-medium text-gray-800 truncate"
              title={item.mediaUrl}
            >
              {item.mediaUrl}
            </h3>
            <p
              className="text-sm text-gray-500 truncate"
              title={item.sourceUrl}
            >
              {item.sourceUrl}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
