import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Plus, FolderOpen, Trash2, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { useNavigate } from "react-router-dom"

export default function Albums() {
  const [albums, setAlbums] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [creating, setCreating] = useState(false)
  const [editingAlbum, setEditingAlbum] = useState(null)
  const [albumName, setAlbumName] = useState("")

  const token = localStorage.getItem("token")
  const navigate = useNavigate()

  // FETCH ALBUMS
  const fetchAlbums = async () => {
    try {
      setLoading(true)
      const res = await axios.get("http://localhost:5000/api/albums", {
        headers: { Authorization: `Bearer ${token}` },
      })

      setAlbums(res.data.data || [])
    } catch (err) {
      console.error(err)
      setError("Failed to load albums")
    } finally {
      setLoading(false)
    }
  }

  // CREATE ALBUM
  const handleCreate = async () => {
    if (!albumName.trim()) return
    try {
      await axios.post(
        "http://localhost:5000/api/albums",
        { name: albumName },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setAlbumName("")
      setCreating(false)
      fetchAlbums()
    } catch (err) {
      console.error(err)
      setError("Failed to create album")
    }
  }

  // EDIT ALBUM
  const handleEdit = async () => {
    if (!albumName.trim() || !editingAlbum) return
    try {
      await axios.put(
        `http://localhost:5000/api/albums/${editingAlbum.id}`,
        { name: albumName },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setEditingAlbum(null)
      setAlbumName("")
      fetchAlbums()
    } catch (err) {
      console.error(err)
      setError("Failed to update album")
    }
  }

  // DELETE ALBUM
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this album?")) return
    try {
      await axios.delete(`http://localhost:5000/api/albums/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      fetchAlbums()
    } catch (err) {
      console.error(err)
      setError(
        err.response?.data?.message ||
          "Failed to delete album"
      )
    }
  }

  useEffect(() => {
    fetchAlbums()
  }, [])

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-3xl font-bold"
        >
          Albums
        </motion.h1>

        <Button onClick={() => setCreating(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Album
        </Button>
      </div>

      {/* Error */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Loading */}
      {loading ? (
        <p>Loading albums...</p>
      ) : albums.length === 0 ? (
        <div className="text-center mt-20 text-muted-foreground">
          <FolderOpen className="mx-auto w-10 h-10 mb-3 opacity-40" />
          <p>No albums yet</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {albums.map((album, index) => (
            <motion.div
              key={album.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition group"
            >
              {/* Album Cover */}
              <div
                className="h-40 bg-gray-100 cursor-pointer"
                onClick={() => navigate(`/dashboard/albums/${album.id}`)}
              >
                {album.cover_image ? (
                  <img
                    src={`http://localhost:5000${album.cover_image}`}
                    alt={album.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <FolderOpen className="w-8 h-8 opacity-40" />
                  </div>
                )}
              </div>

              {/* Album Info */}
              <div className="p-4">
                <h3 className="font-semibold text-lg truncate">
                  {album.name}
                </h3>

                <p className="text-sm text-muted-foreground mt-1">
                  {album.image_count || 0} {album.image_count === 1 ? "photo" : "photos"}
                </p>

                {/* Actions */}
                <div className="flex justify-end gap-3 mt-4">
                  <button
                    onClick={() => {
                      setEditingAlbum(album)
                      setAlbumName(album.name)
                    }}
                  >
                    <Pencil className="w-4 h-4 text-blue-500" />
                  </button>

                  <button onClick={() => handleDelete(album.id)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {(creating || editingAlbum) && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-white p-6 rounded-xl w-96 shadow-xl"
          >
            <h2 className="text-xl font-semibold mb-4">
              {creating ? "Create Album" : "Edit Album"}
            </h2>

            <input
              type="text"
              value={albumName}
              onChange={(e) => setAlbumName(e.target.value)}
              placeholder="Album name"
              className="w-full border rounded-lg p-2 mb-4"
            />

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setCreating(false)
                  setEditingAlbum(null)
                }}
              >
                Cancel
              </Button>

              <Button onClick={creating ? handleCreate : handleEdit}>
                {creating ? "Create" : "Save"}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}