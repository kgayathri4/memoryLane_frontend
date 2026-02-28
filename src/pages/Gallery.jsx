import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import axios from "axios"

export default function Gallery() {
  const [memories, setMemories] = useState([])
  const [loading, setLoading] = useState(true)

  const token = localStorage.getItem("token")

  useEffect(() => {
    const fetchMemories = async () => {
      try {
        const res = await axios.get("http://localhost:5000/memories", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        setMemories(res.data.data)
      } catch (error) {
        console.error("Error fetching gallery memories:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMemories()
  }, [])

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold mb-1">Gallery</h1>
        <p className="text-muted-foreground mb-8">
          All your uploaded memory photos
        </p>
      </motion.div>

      {loading ? (
        <p className="text-muted-foreground">Loading images...</p>
      ) : memories.length === 0 ? (
        <p className="text-muted-foreground">No images found.</p>
      ) : (
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {memories
            .filter((m) => m.image_url) // only show memories with images
            .map((memory, i) => (
              <motion.div
                key={memory.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="break-inside-avoid rounded-xl overflow-hidden cursor-pointer group"
              >
                <img
                  src={memory.image_url}
                  alt={memory.title}
                  className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </motion.div>
            ))}
        </div>
      )}
    </div>
  )
}