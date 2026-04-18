// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const services = [
  {
    number: "01",
    title: "Wedding Photography",
    description: "Timeless and artistic coverage capturing raw emotions and beautiful details.",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80"
  },
  {
    number: "02",
    title: "Cinematic Videography",
    description: "High-end cinematic films crafted with storytelling, music, and precision.",
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80"
  },
  {
    number: "03",
    title: "Pre-Wedding Shoots",
    description: "Creative and personalized pre-wedding concepts in stunning locations.",
    image: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800&q=80"
  },
  {
    number: "04",
    title: "Drone Coverage",
    description: "Breathtaking aerial visuals that elevate your wedding film experience.",
    image: "https://images.unsplash.com/photo-1473415781819-175f02f9036b?w=800&q=80"
  }
];

export default function ServicesSection() {
  const [activeImage, setActiveImage] = useState(services[0].image);

  return (
    <section className="bg-[#050505] text-white py-40 px-6 relative overflow-hidden">
      
      {/* Background Accent */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#C6A75E]/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-start">

        {/* LEFT SIDE: THE VISUAL (Sticky & Dynamic) */}
        <div className="hidden lg:block sticky top-24 h-[70vh] rounded-[2.5rem] overflow-hidden border border-white/5">
          <AnimatePresence mode="wait">
            <motion.img
              key={activeImage}
              src={activeImage}
              initial={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
              animate={{ opacity: 0.6, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
              transition={{ duration: 0.8, ease: "circOut" }}
              className="w-full h-full object-cover"
            />
          </AnimatePresence>
          
          {/* Overlay Text on Image */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent p-12 flex flex-col justify-end">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-6xl font-extralight tracking-tighter leading-none"
            >
              Our <br /> <span className="italic font-serif text-[#C6A75E]">Services.</span>
            </motion.h2>
          </div>
        </div>

        {/* RIGHT SIDE: THE CONTENT (Interactive List) */}
        <div className="py-10 space-y-12">
          {/* Mobile Header */}
          <div className="lg:hidden mb-20">
             <h2 className="text-5xl font-extralight mb-6">Our <span className="italic font-serif text-[#C6A75E]">Services.</span></h2>
          </div>

          {services.map((service, index) => (
            <motion.div
              key={index}
              onMouseEnter={() => setActiveImage(service.image)}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group cursor-pointer relative py-12 border-b border-white/10"
            >
              {/* Hover Background Pill */}
              <div className="absolute inset-0 bg-white/[0.02] scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left -z-10 rounded-2xl" />

              <div className="flex items-start gap-8 px-4">
                <span className="text-[10px] font-black tracking-[0.5em] text-gray-600 group-hover:text-[#C6A75E] transition-colors mt-2">
                  {service.number}
                </span>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-3xl md:text-4xl font-light tracking-tight group-hover:italic group-hover:translate-x-4 transition-all duration-500">
                      {service.title}
                    </h3>
                    <motion.div 
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      animate={activeImage === service.image ? { x: 0 } : { x: -10 }}
                    >
                       <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C6A75E" strokeWidth="1.5">
                          <path d="M7 17L17 7M17 7H7M17 7V17" />
                       </svg>
                    </motion.div>
                  </div>
                  
                  <p className="text-gray-500 group-hover:text-gray-300 transition-colors leading-relaxed font-light max-w-md">
                    {service.description}
                  </p>
                </div>
              </div>

              {/* Bottom Progress Line */}
              <motion.div 
                className="absolute bottom-0 left-0 h-[1px] bg-[#C6A75E] z-20"
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
            </motion.div>
          ))}

          {/* CTA Link */}
          <div className="pt-12 px-4">
            <button className="text-[10px] font-black tracking-[0.4em] uppercase text-[#C6A75E] border-b border-[#C6A75E]/30 pb-2 hover:border-[#C6A75E] transition-all">
              Discuss Your Project
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}