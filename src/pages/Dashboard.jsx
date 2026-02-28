import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { DashboardSidebar } from "@/components/DashboardSidebar"

export default function Dashboard() {
  const { user } = useAuth()

  // 🔒 If not logged in → redirect safely
  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar />

      <main className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  )
}