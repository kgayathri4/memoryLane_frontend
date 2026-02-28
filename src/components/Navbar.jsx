import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 glass"
    >
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Camera className="h-6 w-6 text-warm" />
          <span className="font-display text-xl font-bold text-primary-foreground">BackThen</span>
        </Link>

        <div className="flex items-center gap-3">
          <Button variant="ghost" className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10" asChild>
            <Link to="/login">Login</Link>
          </Button>
          <Button className="gradient-warm text-primary-foreground border-0 shadow-lg shadow-warm/30 hover:shadow-warm/50 transition-shadow" asChild>
            <Link to="/register">Get Started</Link>
          </Button>
        </div>
      </div>
    </motion.nav>
  );
}
