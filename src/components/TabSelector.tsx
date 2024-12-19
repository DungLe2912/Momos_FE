interface TabSelectorProps {
  activeTab: "video" | "image";
  onTabChange: (tab: "video" | "image") => void;
}

export default function TabSelector({
  activeTab,
  onTabChange,
}: TabSelectorProps) {
  return (
    <div className="flex justify-center gap-4 mb-8">
      <button
        className={`px-4 py-2 rounded-md transition-colors ${
          activeTab === "video"
            ? "bg-blue-500 text-white"
            : "bg-gray-200 hover:bg-gray-300"
        }`}
        onClick={() => onTabChange("video")}
      >
        Videos
      </button>
      <button
        className={`px-4 py-2 rounded-md transition-colors ${
          activeTab === "image"
            ? "bg-blue-500 text-white"
            : "bg-gray-200 hover:bg-gray-300"
        }`}
        onClick={() => onTabChange("image")}
      >
        Images
      </button>
    </div>
  );
}
