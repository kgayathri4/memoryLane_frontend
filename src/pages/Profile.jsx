import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  Camera,
  Mail,
  MapPin,
  Calendar,
  Image,
  FolderOpen,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import api from "@/lib/api"

export default function Profile() {
  const [email, setEmail] = useState("")
  const [memoriesCount, setMemoriesCount] = useState(0)
  const [albumsCount, setAlbumsCount] = useState(0)

  const token = localStorage.getItem("token")

  useEffect(() => {
    if (!token) return

    const fetchData = async () => {
      try {
        const memRes = await api.get("/memories", {
          headers: { Authorization: `Bearer ${token}` },
        })

        const albumRes = await api.get("/albums", {
          headers: { Authorization: `Bearer ${token}` },
        })

        setMemoriesCount(memRes.data.data.length)
        setAlbumsCount(albumRes.data.data.length)

        // If backend later returns user info, set it here
        // For now we just decode email from token if needed
      } catch (err) {
        console.error("Error fetching profile data:", err)
      }
    }

    fetchData()
  }, [token])

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold mb-8">
          Profile
        </h1>
      </motion.div>

      {/* Avatar & Stats */}
      <div className="flex flex-col sm:flex-row items-center gap-6 mb-10 p-6 rounded-2xl bg-card border border-border">
        <div className="w-24 h-24 rounded-full gradient-warm flex items-center justify-center text-primary-foreground">
          <Camera className="w-10 h-10" />
        </div>

        <div className="flex-1 text-center sm:text-left">
          <h2 className="font-display text-2xl font-bold">
            Your Account
          </h2>
          <p className="text-muted-foreground">
            {email || "Logged in user"}
          </p>
        </div>

        <div className="flex gap-6">
          <div className="text-center">
            <Image className="w-5 h-5 text-primary mx-auto mb-1" />
            <p className="font-bold">{memoriesCount}</p>
            <p className="text-xs text-muted-foreground">
              Memories
            </p>
          </div>

          <div className="text-center">
            <FolderOpen className="w-5 h-5 text-primary mx-auto mb-1" />
            <p className="font-bold">{albumsCount}</p>
            <p className="text-xs text-muted-foreground">
              Albums
            </p>
          </div>
        </div>
      </div>

      {/* Edit Form (UI Only for Now) */}
      <div className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input placeholder="Your name" />
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={email}
                disabled
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Your city" className="pl-10" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Member Since</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input value="2026" disabled className="pl-10" />
            </div>
          </div>
        </div>

        <Button className="gradient-warm text-primary-foreground border-0 shadow-lg shadow-warm/20">
          Save Changes
        </Button>
      </div>
    </div>
  )
}