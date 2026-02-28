import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

/* -----------------------------
   Sidebar Context
------------------------------*/

const SidebarContext = React.createContext(null)

export function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within <Sidebar>")
  }
  return context
}

/* -----------------------------
   Sidebar Root
------------------------------*/

export function Sidebar({ children, collapsible = false, className }) {
  const [state, setState] = React.useState("expanded")

  const toggle = () => {
    if (collapsible) {
      setState((prev) =>
        prev === "expanded" ? "collapsed" : "expanded"
      )
    }
  }

  return (
    <SidebarContext.Provider value={{ state, toggle }}>
      <aside
        className={cn(
          "flex flex-col h-screen w-64 transition-all duration-300 bg-sidebar",
          state === "collapsed" && "w-20",
          className
        )}
      >
        {children}
      </aside>
    </SidebarContext.Provider>
  )
}

/* -----------------------------
   Layout Sections
------------------------------*/

export function SidebarContent({ children, className }) {
  return (
    <div className={cn("flex-1 overflow-y-auto", className)}>
      {children}
    </div>
  )
}

export function SidebarFooter({ children, className }) {
  return (
    <div className={cn("mt-auto", className)}>
      {children}
    </div>
  )
}

/* -----------------------------
   Group
------------------------------*/

export function SidebarGroup({ children }) {
  return <div className="mb-6">{children}</div>
}

export function SidebarGroupLabel({ children, className }) {
  return (
    <div
      className={cn(
        "px-4 mb-2 text-xs font-semibold tracking-wider uppercase",
        className
      )}
    >
      {children}
    </div>
  )
}

export function SidebarGroupContent({ children }) {
  return <div>{children}</div>
}

/* -----------------------------
   Menu
------------------------------*/

export function SidebarMenu({ children }) {
  return <ul className="space-y-1">{children}</ul>
}

export function SidebarMenuItem({ children }) {
  return <li>{children}</li>
}

export const SidebarMenuButton = React.forwardRef(
  ({ asChild = false, className, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        ref={ref}
        className={cn(
          "flex items-center w-full px-4 py-2 rounded-md text-sm transition-colors hover:bg-sidebar-accent",
          className
        )}
        {...props}
      />
    )
  }
)

SidebarMenuButton.displayName = "SidebarMenuButton"