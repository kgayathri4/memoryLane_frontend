import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"

export default function AlbumDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [memories, setMemories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)

  // Get token from localStorage
  const token = localStorage.getItem("token")

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true })
    } else {
      fetchMemories()
    }
  }, [id, token])

  // Fetch memories from backend
  const fetchMemories = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`http://localhost:5000/api/memories?album_id=${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })

      // Supabase already returns image_url as array (text[])
      const data = Array.isArray(res.data.data) ? res.data.data : []
      setMemories(data)
      setError(null)
    } catch (err) {
      console.error("Fetch error:", err)
      setError(
        err.response?.status === 401
          ? "Unauthorized. Please login."
          : "Failed to load memories."
      )
      setMemories([])
    } finally {
      setLoading(false)
    }
  }

  // Upload multiple images
  const handleUpload = async (e) => {
    e.preventDefault()
    if (!token) {
      alert("You must be logged in to upload")
      return
    }
    if (files.length === 0) return

    const formData = new FormData()
    files.forEach((file) => formData.append("images", file))

    // Required fields for backend
    formData.append("album_id", id)
    formData.append("title", "My Album Memory")
    formData.append("description", "Uploaded via Album")
    formData.append("location", "Unknown")
    formData.append("date", new Date().toISOString())

    try {
      setUploading(true)
      await axios.post("http://localhost:5000/api/memories", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })

      // Reset selected files and refresh gallery
      setFiles([])
      fetchMemories()
    } catch (err) {
      console.error("Upload error:", err)
      alert(
        err.response?.status === 401
          ? "Unauthorized. Please login."
          : "Upload failed."
      )
    } finally {
      setUploading(false)
    }
  }

  // Utility to generate full URL for images
  const getFullUrl = (url) => (url.startsWith("http") ? url : `http://localhost:5000${url}`)

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Album Gallery</h1>

      {/* Upload Section */}
      <form onSubmit={handleUpload} className="flex items-center gap-4 mb-8">
        <input
          type="file"
          multiple
          onChange={(e) => setFiles([...e.target.files])}
          className="border p-2 rounded"
        />
        <button
          type="submit"
          disabled={uploading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>

      {/* Loading / Error */}
      {loading && <p>Loading memories...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Memories Grid */}
      {!loading && memories.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {memories.map((memory) => (
            <div key={memory.id} className="p-4 border rounded-lg shadow hover:shadow-lg transition">
              <h2 className="text-lg font-semibold mb-2">{memory.title}</h2>

              {/* Multiple images per memory */}
              {Array.isArray(memory.image_url) && memory.image_url.length > 0 ? (
                <div className="grid grid-cols-1 gap-2">
                  {memory.image_url.map((url, idx) => (
                    <img
                      key={idx}
                      src={getFullUrl(url)}
                      alt={`${memory.title} ${idx + 1}`}
                      className="w-full h-48 object-cover rounded"
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No images for this memory</p>
              )}

              {/* Photo count */}
              <p className="mt-2 text-sm text-gray-600">
                {Array.isArray(memory.image_url) ? memory.image_url.length : 0} photos
              </p>

              {/* Description */}
              {memory.description && <p className="mt-1 text-sm text-gray-600">{memory.description}</p>}
            </div>
          ))}
        </div>
      )}

      {!loading && memories.length === 0 && (
        <p className="text-gray-500 mt-4">No memories uploaded yet.</p>
      )}
    </div>
  )
}