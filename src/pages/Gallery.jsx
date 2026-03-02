import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { supabase } from "@/lib/supabase"

export default function Gallery() {
  const [memories, setMemories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMemories = async () => {
      setLoading(true)

      const { data, error } = await supabase
        .from("memories")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching memories:", error)
      } else {
        setMemories(data || [])
      }

      setLoading(false)
    }

    fetchMemories()
  }, [])

  return (
    <div>
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display text-3xl font-bold mb-1">
          Gallery
        </h1>
        <p className="text-muted-foreground mb-8">
          All your uploaded memory photos
        </p>
      </motion.div>

      {/* Loading State */}
      {loading ? (
        <p className="text-muted-foreground">
          Loading images...
        </p>
      ) : memories.length === 0 ? (
        <p className="text-muted-foreground">
          No images found.
        </p>
      ) : (
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {memories.map((memory, i) => (
            <motion.div
              key={memory.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="break-inside-avoid rounded-xl overflow-hidden cursor-pointer group"
            >
              <img
                src={memory.image_url}  // ✅ Make sure this matches your table column
                alt={memory.title || "Memory Image"}
                className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}