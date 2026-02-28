import {
  Camera,
  Clock,
  Image,
  FolderOpen,
  Mic,
  Search,
  UserCircle,
  Upload,
  LogOut,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Timeline", url: "/dashboard", icon: Clock },
  { title: "Gallery", url: "/dashboard/gallery", icon: Image },
  { title: "Albums", url: "/dashboard/albums", icon: FolderOpen },
  { title: "Upload Memory", url: "/dashboard/upload", icon: Upload },
  { title: "Voice Notes", url: "/dashboard/voice", icon: Mic },
  { title: "Search", url: "/dashboard/search", icon: Search },
  { title: "Profile", url: "/dashboard/profile", icon: UserCircle },
];

export function DashboardSidebar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <Sidebar collapsible className="border-r">
      <SidebarContent className="pt-4">

        <div className="px-4 mb-6 flex items-center gap-2">
          <Camera className="h-6 w-6" />
          <span className="font-bold text-lg">BackThen</span>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        `flex items-center ${
                          isActive ? "text-primary font-medium" : ""
                        }`
                      }
                      end={item.url === "/dashboard"}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>

      <SidebarFooter className="p-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm w-full"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}