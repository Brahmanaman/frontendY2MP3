import { useState } from "react";

const BASE_URL = "https://backendy2mp3-production.up.railway.app";
// const BASE_URL = "http://localhost:8080";

const FORMATS = [
  { id: "mp3", label: "MP3", desc: "Audio", type: "audio" },
  { id: "m4a", label: "M4A", desc: "Audio", type: "audio" },
  { id: "wav", label: "WAV", desc: "Audio", type: "audio" },
  { id: "mp4", label: "MP4", desc: "Best Quality", type: "video" },
  { id: "mp4_720", label: "MP4 720p", desc: "HD", type: "video" },
  { id: "mp4_480", label: "MP4 480p", desc: "SD", type: "video" },
  { id: "webm", label: "WebM", desc: "Video", type: "video" },
];

export default function Downloader() {
  const [url, setUrl] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [video, setVideo] = useState(null);
  const [selectedFormat, setSelectedFormat] = useState("mp3");
  const [error, setError] = useState("");

  const fetchInfo = async () => {
    if (!url) return;
    setIsFetching(true);
    setVideo(null);
    setError("");

    try {
      const res = await fetch(`${BASE_URL}/info`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setVideo(data);
    } catch {
      setError("Could not fetch video. Check the URL and try again.");
    } finally {
      setIsFetching(false);
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    setError("");

    try {
      const res = await fetch(`${BASE_URL}/download`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, format: selectedFormat }),
      });
      if (!res.ok) throw new Error("Failed");

      const fmt = FORMATS.find((f) => f.id === selectedFormat);
      const ext = fmt?.label.split(" ")[0].toLowerCase();
      const blob = await res.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `${video?.title || "media"}.${ext}`;
      link.click();
      window.URL.revokeObjectURL(link.href);
    } catch {
      setError("Download failed. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const audioFormats = FORMATS.filter((f) => f.type === "audio");
  const videoFormats = FORMATS.filter((f) => f.type === "video");
  const selectedFmt = FORMATS.find((f) => f.id === selectedFormat);

  return (
    <div className="h-full w-full bg-zinc-950 flex flex-col items-center justify-center px-4 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-white tracking-tight">
          YT <span className="text-red-500">Downloader</span>
        </h1>
        <p className="text-zinc-500 text-sm mt-2">
          Download YouTube videos & audio in any format
        </p>
      </div>

      {/* URL Input */}
      <div className="flex gap-2 w-full max-w-xl mb-4">
        <input
          type="text"
          placeholder="Paste YouTube URL here..."
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setVideo(null);
            setError("");
          }}
          onKeyDown={(e) => e.key === "Enter" && fetchInfo()}
          className="flex-1 bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition"
        />
        <button
          onClick={fetchInfo}
          disabled={isFetching || !url}
          className="bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-5 py-3 rounded-xl text-sm transition flex items-center gap-2"
        >
          {isFetching ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            "Search"
          )}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="w-full max-w-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3 mb-4 text-center">
          {error}
        </div>
      )}

      {/* Video Card */}
      {video && (
        <div className="w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col gap-5">
          {/* Thumbnail + Info */}
          <div className="flex gap-4 items-start">
            <img
              src={video.thumbnail}
              alt="thumbnail"
              className="w-28 h-[70px] object-cover rounded-xl flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm leading-snug line-clamp-2">
                {video.title}
              </p>
              {video.channel && (
                <p className="text-zinc-500 text-xs mt-1">{video.channel}</p>
              )}
              {video.duration && (
                <p className="text-zinc-500 text-xs mt-0.5">
                  ⏱ {video.duration}
                </p>
              )}
            </div>
          </div>

          {/* Format Selector */}
          <div className="flex flex-col gap-3">
            {/* Audio */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-600 mb-2">
                Audio
              </p>
              <div className="flex flex-wrap gap-2">
                {audioFormats.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setSelectedFormat(f.id)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium border transition
                                            ${
                                              selectedFormat === f.id
                                                ? "border-red-500 bg-red-500/10 text-red-400"
                                                : "border-zinc-700 bg-zinc-800 text-zinc-400 hover:border-red-500 hover:text-white"
                                            }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Video */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-600 mb-2">
                Video
              </p>
              <div className="flex flex-wrap gap-2">
                {videoFormats.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setSelectedFormat(f.id)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium border transition
                                            ${
                                              selectedFormat === f.id
                                                ? "border-red-500 bg-red-500/10 text-red-400"
                                                : "border-zinc-700 bg-zinc-800 text-zinc-400 hover:border-red-500 hover:text-white"
                                            }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="w-full bg-red-500 hover:bg-red-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-red-500/20"
          >
            {isDownloading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {selectedFmt?.type === "video"
                  ? "Processing video... (this may take a while)"
                  : "Downloading..."}
              </>
            ) : (
              `Download ${selectedFmt?.label}`
            )}
          </button>
        </div>
      )}
    </div>
  );
}
