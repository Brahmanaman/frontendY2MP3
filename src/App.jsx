import Downloader from './components/Downloader'

const App = () => {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-10 rounded shadow-lg">

        <h1 className="text-2xl font-bold mb-6 text-center">
          YouTube to MP3 Downloader
        </h1>

        <Downloader />

      </div>

    </div>
  )
}

export default App