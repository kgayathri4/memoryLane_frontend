import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Plus, FolderOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import axios from "axios"

export default function Albums() {
  const [albums, setAlbums] = useState([])
  const token = localStorage.getItem("token")

  const fetchAlbums = async () => {
    const res = await axios.get("http://localhost:5000/albums", {
      headers: { Authorization: `Bearer ${token}` },
    })
    setAlbums(res.data.data)
  }

  const handleCreateAlbum = async () => {
    const name = prompt("Enter album name:")
    if (!name) return

    await axios.post(
      "http://localhost:5000/albums",
      { name },
      { headers: { Authorization: `Bearer ${token}` } }
    )

    fetchAlbums()
  }

  useEffect(() => {
    fetchAlbums()
  }, [])

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">Albums</h1>
        <Button onClick={handleCreateAlbum}>
          <Plus className="w-4 h-4 mr-2" />
          New Album
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {albums.map((album) => (
          <div key={album.id} className="p-4 border rounded-lg">
            <FolderOpen className="w-6 h-6 mb-2" />
            <h3 className="font-semibold">{album.name}</h3>
          </div>
        ))}
      </div>
    </div>
  )
}