import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

const SearchMemories = () => {
  const [memories, setMemories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchMemories()
  }, [])

  const fetchMemories = async () => {
    setLoading(true)
    setError("")

    const { data, error } = await supabase
      .from("memories")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching memories:", error.message)
      setError("Failed to fetch memories")
    } else {
      setMemories(data)
    }

    setLoading(false)
  }

  if (loading) return <p className="text-center">Loading...</p>
  if (error) return <p className="text-red-500 text-center">{error}</p>

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">All Memories</h2>

      {memories.length === 0 ? (
        <p>No memories found.</p>
      ) : (
        <div className="grid gap-6">
          {memories.map((memory) => (
            <div
              key={memory.id}
              className="border p-4 rounded-lg shadow"
            >
              {memory.image_url && (
                <img
                  src={memory.image_url}
                  alt={memory.title}
                  className="w-full h-64 object-cover rounded mb-3"
                />
              )}

              <h3 className="text-lg font-semibold">
                {memory.title}
              </h3>

              <p>{memory.description}</p>

              {memory.location && (
                <p className="text-sm text-gray-500">
                  📍 {memory.location}
                </p>
              )}

              {memory.date && (
                <p className="text-sm text-gray-500">
                  📅 {memory.date}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchMemories