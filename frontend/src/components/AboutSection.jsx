// eslint-disable-next-line no-unused-vars
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const storyData = [
  {
    tag: "THE ORIGIN",
    title: "Our Beginning",
    text: "What started as a raw passion for visual storytelling has evolved into a dedicated pursuit of capturing the fleeting, honest moments that define a wedding day."
  },
  {
    tag: "THE BELIEF",
    title: "Our Philosophy",
    text: "We don't just take photographs; we document legacies. Every couple carries a unique frequency of love that deserves to be framed with absolute authenticity and timeless elegance."
  },
  {
    tag: "THE PROMISE",
    title: "Our Vision",
    text: "Our goal is to create cinematic archives that don't just look beautiful today, but feel profoundly emotional and nostalgic when you look back decades from now."
  }
];

export default function AboutSection() {
  const containerRef = useRef(null);
  
  // Parallax effect for the image
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section ref={containerRef} className="relative bg-[#fcfcfc] text-black py-32 px-6 overflow-hidden">
      
      {/* BACKGROUND ACCENT - Subtle floating number or text */}
      <div className="absolute top-20 left-10 opacity-[0.03] pointer-events-none select-none">
        <h1 className="text-[20vw] font-serif leading-none italic">Est. 2024</h1>
      </div>

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 lg:gap-24 items-start">
        
        {/* LEFT - STICKY IMAGE FRAME */}
        <div className="sticky top-12 md:top-24 h-fit">
          <div className="relative group">
            {/* Artistic Border Frame */}
            <div className="absolute -inset-4 border border-[#C6A75E]/20 rounded-[2rem] -z-10 transition-transform duration-700 group-hover:scale-105" />
            
            <div className="overflow-hidden rounded-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] bg-gray-200">
              <motion.img
                style={{ y }}
                src="https://images.unsplash.com/photo-1542042161784-26ab9e041e89?w=800&auto=format&fit=crop&q=80"
                alt="Studio Aesthetic"
                className="w-full h-[500px] md:h-[750px] object-cover scale-110"
              />
            </div>

            {/* Float Label */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="absolute -bottom-6 -right-6 bg-[#C6A75E] text-black p-6 rounded-xl hidden lg:block"
            >
              <p className="text-[10px] font-black tracking-[0.3em] uppercase">Authentic Storytelling</p>
            </motion.div>
          </div>
        </div>

        {/* RIGHT - STORY CONTENT */}
        <div className="space-y-40 py-20">
          {storyData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true, margin: "-100px" }}
              className="relative"
            >
              {/* Vertical accent line */}
              <div className="absolute -left-8 top-0 bottom-0 w-[1px] bg-gradient-to-b from-[#C6A75E] to-transparent opacity-40" />
              
              <span className="text-[10px] font-bold tracking-[0.5em] text-[#C6A75E] mb-6 block">
                {item.tag}
              </span>
              
              <h2 className="text-4xl md:text-5xl font-extralight tracking-tight mb-8 font-serif italic text-gray-900">
                {item.title}
              </h2>
              
              <p className="text-lg md:text-xl text-gray-500 leading-relaxed font-light max-w-md">
                {item.text}
              </p>
            </motion.div>
          ))}
          
          {/* FINAL CALL TO ACTION INSIDE STORY */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="pt-10"
          >
            <p className="text-sm text-gray-400 font-serif italic mb-4">Are you ready to tell your story?</p>
            <button 
               onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
               className="text-[10px] font-black tracking-[0.4em] uppercase border-b-2 border-[#C6A75E] pb-2 hover:text-[#C6A75E] transition-all"
            >
              Let's connect
            </button>
          </motion.div>
        </div>

      </div>
    </section>
  );
}