import { Instagram, Facebook, Mail, MapPin, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  // Smooth scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#050505] text-white pt-32 pb-12 px-6 border-t border-white/5 relative overflow-hidden">
      
      {/* BACKGROUND DECOR - Subtle Watermark */}
      <div className="absolute top-10 right-[-5%] opacity-[0.02] pointer-events-none select-none">
        <h2 className="text-[15vw] font-serif italic leading-none">Bingo</h2>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* MAIN GRID */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-24">

          {/* BRAND COLUMN */}
          <div className="md:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-3xl font-extralight tracking-tighter mb-6">
                Wedding <span className="italic font-serif text-[#C6A75E]">Bingo.</span>
              </h3>
              <p className="text-gray-500 max-w-sm leading-relaxed font-light text-sm mb-8">
                Capturing the quiet glances, the grand celebrations, and the timeless 
                narratives of love across the globe. Documenting your legacy with 
                unrivaled elegance.
              </p>
              
              {/* SOCIAL ICONS */}
              <div className="flex gap-4">
                {[
                  { icon: <Instagram size={18} />, link: "#" },
                  { icon: <Facebook size={18} />, link: "#" },
                  { icon: <Mail size={18} />, link: "mailto:hello@weddingbingo.com" }
                ].map((social, i) => (
                  <a
                    key={i}
                    href={social.link}
                    className="w-11 h-11 flex items-center justify-center border border-white/10 rounded-full hover:border-[#C6A75E] hover:text-[#C6A75E] transition-all duration-500 bg-white/[0.02]"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* NAVIGATION COLUMN */}
          <div className="md:col-span-3">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#C6A75E] mb-8">Navigate</h4>
            <ul className="space-y-4">
              {["Home", "Services", "Portfolio", "Contact"].map((item) => (
                <li key={item}>
                  <Link 
                    to={`/${item === "Home" ? "" : item.toLowerCase()}`}
                    className="text-gray-400 hover:text-white transition-colors flex items-center group text-sm font-light"
                  >
                    {item}
                    <ArrowUpRight size={12} className="ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-[#C6A75E]" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* STUDIO INFO COLUMN */}
          <div className="md:col-span-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#C6A75E] mb-8">Studio</h4>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin size={18} className="text-[#C6A75E] mt-1 shrink-0" />
                <p className="text-gray-400 text-sm font-light leading-relaxed">
                  Available for destination weddings worldwide. <br />
                  <span className="text-white">Based in Mumbai, India.</span>
                </p>
              </div>
              
              <div className="pt-4">
                <p className="text-[10px] text-gray-600 uppercase tracking-widest mb-2">Bookings Open</p>
                <p className="text-sm font-serif italic text-gray-300">Limited slots available for 2026/27</p>
              </div>
            </div>
          </div>

        </div>

        {/* BOTTOM BAR */}
        <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
          
          <p className="text-[10px] text-gray-600 uppercase tracking-widest text-center md:text-left">
            © {currentYear} Wedding Bingo • Crafted by <span className="text-gray-400">PrimeCode Studio</span>
          </p>

          <button 
            onClick={scrollToTop}
            className="group flex items-center gap-3 text-[10px] text-gray-500 hover:text-[#C6A75E] transition-colors uppercase tracking-[0.3em] font-bold"
          >
            Back to Top
            <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#C6A75E] transition-all">
              <ArrowUpRight size={14} className="-rotate-45" />
            </div>
          </button>

        </div>

      </div>
    </footer>
  );
}