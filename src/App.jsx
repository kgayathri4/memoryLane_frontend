import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AuthProvider } from "@/context/AuthContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

// Pages
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import Timeline from "@/pages/Timeline";
import Gallery from "@/pages/Gallery";
import Albums from "@/pages/Albums";
import AlbumDetail from "@/pages/AlbumDetail"; // make sure filename matches exactly
import MemoryUpload from "@/pages/MemoryUpload";
import VoiceNotes from "@/pages/VoiceNotes";
import SearchMemories from "@/pages/SearchMemories";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <BrowserRouter>

            <Toaster />
            <Sonner />

            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Dashboard Layout Route */}
              <Route path="/dashboard" element={<Dashboard />}>

                {/* Default dashboard page */}
                <Route index element={<Timeline />} />

                {/* Nested routes */}
                <Route path="gallery" element={<Gallery />} />
                <Route path="albums" element={<Albums />} />
                <Route path="albums/:id" element={<AlbumDetail />} />
                <Route path="upload" element={<MemoryUpload />} />
                <Route path="voice" element={<VoiceNotes />} />
                <Route path="search" element={<SearchMemories />} />
                <Route path="profile" element={<Profile />} />

              </Route>

              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />

            </Routes>

          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;