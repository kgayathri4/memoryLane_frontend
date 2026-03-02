import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import api from "@/lib/api"

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      setError("Please fill all fields")
      return
    }

    try {
      setLoading(true)
      setError("")

      const res = await api.post("/auth/login", { email, password })
      const token = res.data?.data?.token
      const user = res.data?.data?.user

      if (!token || !user) throw new Error("Login failed, token missing")

      // ✅ Save token & user in localStorage for future API calls
      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(user))

      // ✅ Save in context
      login(user, token)

      navigate("/dashboard", { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md bg-card p-8 rounded-2xl shadow-lg border border-border">
        <h2 className="text-2xl font-bold mb-6 text-center">Welcome Back</h2>

        {error && <p className="text-red-500 mb-4 text-sm text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm mb-2">Email</label>
            <input
              type="email"
              className="w-full p-3 border rounded-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-2">Password</label>
            <input
              type="password"
              className="w-full p-3 border rounded-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-lg"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-sm text-center mt-6">
          Don’t have an account?{" "}
          <Link to="/register" className="text-primary underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}