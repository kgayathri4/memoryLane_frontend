import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

const Index = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token")

    if (token) {
      navigate("/dashboard")
    }
  }, [navigate])

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center max-w-2xl"
      >
        <h1 className="mb-4 text-4xl md:text-5xl font-bold font-display">
          BackThen Timeline
        </h1>

        <p className="text-lg text-muted-foreground mb-8">
          Capture your memories, organize them into albums, and relive your
          favorite moments anytime.
        </p>

        <div className="flex gap-4 justify-center">
          <Button onClick={() => navigate("/login")}>
            Login
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate("/register")}
          >
            Create Account
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

export default Index