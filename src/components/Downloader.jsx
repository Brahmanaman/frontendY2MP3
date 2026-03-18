import { useState } from "react"

function Downloader() {
    const [url, setUrl] = useState("")
    const [isFetching, setIsFetching] = useState(false)
    const [isDownloading, setIsDownloading] = useState(false)
    const [video, setVideo] = useState(null)

    const fetchInfo = async () => {
        if (!url) return
        setIsFetching(true)
        setVideo(null)

        try {
            const res = await fetch("https://backendy2mp3-production.up.railway.app/info", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url })
            })
            const data = await res.json()
            setVideo(data)
        } catch (error) {
            console.error("Error fetching info:", error)
        } finally {
            setIsFetching(false)
        }
    }

    const handleDownload = async () => {
        setIsDownloading(true)

        try {
            const res = await fetch("https://backendy2mp3-production.up.railway.app/download", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url })
            })

            const blob = await res.blob()
            const link = document.createElement("a")
            link.href = window.URL.createObjectURL(blob)
            link.download = `${video?.title || 'audio'}.mp3`
            link.click()

            window.URL.revokeObjectURL(link.href)
        } catch (error) {
            console.error("Download failed:", error)
        } finally {
            setIsDownloading(false)
        }
    }

    return (
        <div className="flex flex-col items-center gap-6 p-10">
            <div className="flex gap-2">
                <input
                    type="text"
                    placeholder="Paste YouTube URL"
                    className="border p-3 w-80 rounded shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                />
                <button
                    onClick={fetchInfo}
                    disabled={isFetching || !url}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded disabled:bg-gray-400 transition-colors"
                >
                    {isFetching ? "Searching..." : "Get Video"}
                </button>
            </div>

            {video && (
                <div className="flex flex-col items-center gap-4 p-6 border rounded-xl shadow-lg bg-white w-full max-w-sm">
                    <img
                        src={video.thumbnail}
                        alt="thumbnail"
                        className="w-full rounded-lg shadow-sm"
                    />
                    <h2 className="text-md font-bold text-center leading-tight">
                        {video.title}
                    </h2>

                    <button
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className={`w-full py-3 rounded-full font-bold text-white transition-all 
                            ${isDownloading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-red-500 hover:bg-red-600 active:scale-95"
                            }`}
                    >
                        {isDownloading ? (
                            <span className="flex items-center justify-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Downloading...
                            </span>
                        ) : (
                            "Download MP3"
                        )}
                    </button>
                </div>
            )}
        </div>
    )
}

export default Downloader