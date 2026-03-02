import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Camera, Heart, Clock, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/Navbar"
import heroBg from "@/assets/hero-bg.jpg"

const features = [
  { icon: Clock, title: "Timeline View", desc: "Relive your memories in a beautiful chronological timeline." },
  { icon: Camera, title: "Photo Albums", desc: "Organize your precious moments into themed albums." },
  { icon: Heart, title: "Reminisce", desc: "Get daily memories from your past to brighten your day." },
  { icon: Users, title: "Share Together", desc: "Collaborate on albums with friends and family." },
]

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <img
          src={heroBg}
          alt="Hero background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/70 via-navy/50 to-navy/90" />
        <Navbar />

        <div className="relative z-10 container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-primary-foreground mb-6 leading-tight">
              Your Memories,<br />
              <span className="text-gradient">Beautifully Kept</span>
            </h1>

            <p className="text-lg md:text-xl text-primary-foreground/70 max-w-2xl mx-auto mb-10 font-light">
              Capture, organize, and relive your most precious moments.
              BackThen turns your memories into a stunning visual journey through time.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="gradient-warm text-primary-foreground border-0 text-lg px-8 py-6 shadow-xl shadow-warm/30 hover:shadow-warm/50 transition-all"
                asChild
              >
                <Link to="/register">Start Your Timeline</Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/30 text-primary-foreground hover:bg-white/10 text-lg px-8 py-6"
                asChild
              >
                <Link to="/login">Sign In</Link>
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-primary-foreground/30 flex items-start justify-center p-1.5">
            <div className="w-1.5 h-3 rounded-full bg-primary-foreground/50" />
          </div>
        </motion.div>
      </div>

      {/* Features */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Every Moment <span className="text-gradient">Matters</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              BackThen gives you powerful tools to preserve and celebrate your life's story.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-8 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl gradient-warm flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <f.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">
                  {f.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-navy border-t border-sidebar-border">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-warm" />
            <span className="font-display text-sm text-navy-foreground">
              BackThen
            </span>
          </div>
          <p className="text-sm text-navy-foreground/50">
            © 2026 BackThen. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}