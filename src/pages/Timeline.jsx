import { motion } from "framer-motion";
import { MapPin, Calendar, Heart, Share2, Tag } from "lucide-react";

const mockMemories = [
  { id: 1, title: "Summer at the Beach", description: "An unforgettable day with golden sand and clear water.", date: "Aug 15, 2025", location: "Malibu, CA", tags: ["summer", "beach"], image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop" },
  { id: 2, title: "Mountain Sunrise", description: "Woke up at 4am to catch this breathtaking view.", date: "Jul 3, 2025", location: "Rocky Mountains", tags: ["nature", "sunrise"], image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=400&fit=crop" },
  { id: 3, title: "Birthday Celebration", description: "Surrounded by the people I love most.", date: "May 20, 2025", location: "Home", tags: ["birthday", "family"], image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&h=400&fit=crop" },
  { id: 4, title: "First Snow of Winter", description: "The world turned white overnight. Pure magic.", date: "Dec 1, 2024", location: "Aspen, CO", tags: ["winter", "snow"], image: "https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=600&h=400&fit=crop" },
];

export default function Timeline() {
  return (
    <div className="max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold mb-1">Your Timeline</h1>
        <p className="text-muted-foreground mb-8">A journey through your cherished memories</p>
      </motion.div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />

        <div className="space-y-8">
          {mockMemories.map((memory, i) => (
            <motion.div
              key={memory.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative pl-16"
            >
              {/* Dot */}
              <div className="absolute left-4 top-6 w-4 h-4 rounded-full gradient-warm border-4 border-background" />

              <div className="group rounded-2xl overflow-hidden bg-card border border-border hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
                <img src={memory.image} alt={memory.title} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="p-5">
                  <h3 className="font-display text-xl font-semibold mb-1">{memory.title}</h3>
                  <p className="text-muted-foreground text-sm mb-3">{memory.description}</p>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{memory.date}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{memory.location}</span>
                    {memory.tags.map(t => (
                      <span key={t} className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        <Tag className="w-3 h-3" />{t}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 mt-4 pt-3 border-t border-border">
                    <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-accent transition-colors">
                      <Heart className="w-4 h-4" /> Like
                    </button>
                    <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
                      <Share2 className="w-4 h-4" /> Share
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
