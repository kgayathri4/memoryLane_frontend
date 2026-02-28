import { useLocation, useNavigate, Link } from "react-router-dom"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"

const NotFound = () => {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    )
  }, [location.pathname])

  const token = localStorage.getItem("token")

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="text-center max-w-md">
        <h1 className="mb-4 text-6xl font-bold font-display">
          404
        </h1>

        <p className="mb-6 text-lg text-muted-foreground">
          Oops! The page you're looking for doesn't exist.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {token ? (
            <Button onClick={() => navigate("/dashboard")}>
              Go to Dashboard
            </Button>
          ) : (
            <Button asChild>
              <Link to="/">Return Home</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default NotFound