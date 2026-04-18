import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const CinematicHero = () => {
  const containerRef = React.useRef(null);
  
  // Subtle Parallax for the main image
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section 
      ref={containerRef}
      className="relative bg-[#050505] text-white py-32 lg:py-48 px-6 overflow-hidden"
    >
      {/* Background Decorative Accent */}
      <div className="absolute top-0 right-0 w-[50%] h-full bg-[#C6A75E]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          
          {/* IMAGE SIDE (Left - Editorial Frame) */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: "circOut" }}
            viewport={{ once: true }}
            className="lg:col-span-6 relative"
          >
            {/* The Main Image with Parallax */}
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] border border-white/5 shadow-2xl">
              <motion.img
                style={{ y, scale: 1.1 }}
                src="https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=1000"
                alt="The Wedding Narrative"
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            </div>

            {/* Floating Achievement Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="absolute -bottom-8 -right-8 bg-[#C6A75E] p-8 rounded-3xl hidden md:block shadow-2xl"
            >
              <h4 className="text-black font-serif italic text-3xl leading-none">150+</h4>
              <p className="text-black/60 text-[9px] uppercase tracking-widest font-bold mt-2">Destinations <br /> Explored</p>
            </motion.div>
          </motion.div>

          {/* CONTENT SIDE (Right - Typography) */}
          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <span className="text-[10px] tracking-[0.6em] text-[#C6A75E] uppercase font-bold mb-6 block">
                The Philosophy
              </span>
              
              <h1 className="text-6xl md:text-8xl font-extralight tracking-tighter leading-[0.9] mb-8">
                Not Just <span className="italic font-serif text-[#C6A75E]">Photos.</span>
                <br />
                <span className="text-white">Emotions.</span>
              </h1>

              <p className="text-gray-500 text-lg md:text-xl font-light leading-relaxed max-w-lg mb-10">
                Every wedding tells a unique story. We focus on the <span className="text-gray-300">authentic pauses</span> — the quiet glances and the grandest celebrations.
              </p>

              {/* STATS (Refined Layout) */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-10 border-t border-white/5">
                {[
                  { label: "Weddings", val: "500+" },
                  { label: "Experience", val: "8+ Yrs" },
                  { label: "Satisfaction", val: "100%" },
                ].map((stat, i) => (
                  <div key={i}>
                    <h3 className="text-2xl font-light text-white mb-1">{stat.val}</h3>
                    <p className="text-[10px] text-gray-600 uppercase tracking-widest font-medium">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* CALL TO ACTION */}
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-14"
              >
                <Link to="/gallery" className="group relative inline-flex items-center gap-4">
                  <div className="bg-[#C6A75E] text-black w-14 h-14 rounded-full flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                    <ArrowRight size={24} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white group-hover:text-[#C6A75E] transition-colors">
                    Discover Our Work
                  </span>
                  
                  {/* Decorative underline */}
                  <div className="absolute -bottom-2 left-16 right-0 h-[1px] bg-white/10 overflow-hidden">
                    <motion.div 
                      className="h-full bg-[#C6A75E] w-full"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "0%" }}
                    />
                  </div>
                </Link>
              </motion.div>
            </motion.div>
          </div>

        </div>
      </div>

      {/* Decorative vertical line */}
      <div className="absolute left-1/2 bottom-0 w-[1px] h-32 bg-gradient-to-t from-[#C6A75E] to-transparent opacity-20 hidden lg:block" />
    </section>
  );
};

export default CinematicHero;