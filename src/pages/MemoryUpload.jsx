import { useState } from "react"
import { supabase } from "@/lib/supabase"

const MemoryUpload = () => {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [date, setDate] = useState("")
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files))
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setFiles(Array.from(e.dataTransfer.files))
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  // Upload image to Supabase Storage
  const uploadImage = async (file) => {
    const fileName = `${Date.now()}-${file.name}`

    const { error } = await supabase.storage
      .from("memory-images")
      .upload(fileName, file)

    if (error) {
      console.error("Upload error:", error.message)
      return null
    }

    const { data } = supabase.storage
      .from("memory-images")
      .getPublicUrl(fileName)

    return data?.publicUrl || null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!title) {
      setError("Title is required")
      return
    }

    if (files.length === 0) {
      setError("Please add at least one image")
      return
    }

    setLoading(true)
    setError("")
    setMessage("")

    try {
      // Upload all images
      const uploadPromises = files.map((file) => uploadImage(file))
      const imageUrls = await Promise.all(uploadPromises)

      const validUrls = imageUrls.filter((url) => url !== null)

      if (validUrls.length === 0) {
        throw new Error("Image upload failed")
      }

      // Insert into Supabase DB
      const { error: insertError } = await supabase
        .from("memories") // <-- Your table name
        .insert(
          validUrls.map((url) => ({
            title,
            description,
            image_url: url,
            location,
            date,
          }))
        )

      if (insertError) throw insertError

      setMessage("Memories saved successfully!")

      // Reset form
      setTitle("")
      setDescription("")
      setLocation("")
      setDate("")
      setFiles([])

    } catch (err) {
      console.error("Save error:", err.message)
      setError(err.message || "Failed to save memories")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex justify-center items-center px-4">
      <div className="w-full max-w-lg bg-card p-6 rounded-xl shadow-lg border border-border">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Add Multiple Memories
        </h2>

        {message && <p className="text-green-600 mb-3">{message}</p>}
        {error && <p className="text-red-500 mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            placeholder="Title"
            className="w-full border p-3 rounded-lg"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <textarea
            placeholder="Description"
            className="w-full border p-3 rounded-lg"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed p-6 text-center rounded-lg cursor-pointer"
          >
            {files.length > 0 ? (
              <div className="text-sm">
                {files.map((file, index) => (
                  <p key={index}>{file.name}</p>
                ))}
              </div>
            ) : (
              <p>Drag & Drop Images Here</p>
            )}
          </div>

          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="w-full"
          />

          <input
            type="text"
            placeholder="Location"
            className="w-full border p-3 rounded-lg"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <input
            type="date"
            className="w-full border p-3 rounded-lg"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-primary text-white p-3 rounded-lg"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Memories"}
          </button>

        </form>
      </div>
    </div>
  )
}

export default MemoryUpload