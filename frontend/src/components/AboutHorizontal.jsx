// eslint-disable-next-line no-unused-vars
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function AboutHorizontal() {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
  });

  // Move exactly 3 screens
  const x = useTransform(scrollYProgress, [0, 1], ["0vw", "-200vw"]);
  
  // Background color shift (Deep Black to a Very Dark Gold Tint)
  const background = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ["#050505", "#0a0a0a", "#0d0c0a"]
  );

  // Progress indicator transforms
  const progressWidth0 = useTransform(scrollYProgress, [0/3, 1/3], [20, 60]);
  const progressWidth1 = useTransform(scrollYProgress, [1/3, 2/3], [20, 60]);
  const progressWidth2 = useTransform(scrollYProgress, [2/3, 3/3], [20, 60]);
  const progressOpacity0 = useTransform(scrollYProgress, [0/3, 1/3], [0.2, 1]);
  const progressOpacity1 = useTransform(scrollYProgress, [1/3, 2/3], [0.2, 1]);
  const progressOpacity2 = useTransform(scrollYProgress, [2/3, 3/3], [0.2, 1]);

  const progressWidths = [progressWidth0, progressWidth1, progressWidth2];
  const progressOpacities = [progressOpacity0, progressOpacity1, progressOpacity2];

  return (
    <motion.section 
      ref={ref} 
      style={{ background }}
      className="relative h-[400vh] text-white"
    >
      {/* STICKY WRAPPER */}
      <div className="sticky top-0 h-screen overflow-hidden flex items-center">
        
        {/* SLIDING CONTENT */}
        <motion.div className="flex" style={{ x }}>

          {/* SLIDE 1: THE ORIGIN */}
          <div className="w-screen h-screen flex-none px-6 md:px-16 lg:px-32 flex flex-col justify-center relative">
            <motion.span 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-[10px] tracking-[0.8em] text-[#C6A75E] uppercase mb-8 font-bold"
            >
              01 / The Beginning
            </motion.span>
            <h1 className="text-[clamp(3rem,8vw,7rem)] font-extralight tracking-tighter leading-none mb-8">
              Our <span className="italic font-serif">Story.</span>
            </h1>
            <p className="max-w-xl text-gray-500 text-lg md:text-xl font-light leading-relaxed">
              What started as a raw passion for visual storytelling evolved into a dedicated 
              pursuit of capturing the honest, fleeting moments that define a wedding day.
            </p>
            {/* Background Decorative Text */}
            <h2 className="absolute bottom-10 right-20 text-[15vw] font-black text-white/[0.02] pointer-events-none select-none">
              HISTORY
            </h2>
          </div>

          {/* SLIDE 2: THE PHILOSOPHY */}
          <div className="w-screen h-screen flex-none px-6 md:px-16 lg:px-32 flex flex-col justify-center relative bg-white/[0.01]">
            <span className="text-[10px] tracking-[0.8em] text-[#C6A75E] uppercase mb-8 font-bold">
              02 / The Approach
            </span>
            <h1 className="text-[clamp(3rem,8vw,7rem)] font-extralight tracking-tighter leading-none mb-8">
              The <span className="italic font-serif text-[#C6A75E]">Craft.</span>
            </h1>
            <p className="max-w-xl text-gray-400 text-lg md:text-xl font-light leading-relaxed">
              Every frame is a curated composition. We blend fine-art elegance with 
              candid reality, ensuring your legacy is preserved in its truest form.
            </p>
            <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-[#C6A75E]/5 blur-[120px] rounded-full pointer-events-none" />
          </div>

          {/* SLIDE 3: THE ARTIST (PRADEEP) */}
          <div className="w-screen h-screen flex-none px-6 md:px-16 lg:px-32 flex items-center relative">
            <div className="max-w-7xl w-full mx-auto grid md:grid-cols-12 gap-10 items-center">
              
              {/* IMAGE COLUMN */}
              <div className="md:col-span-5 relative group">
                <div className="absolute -inset-4 border border-[#C6A75E]/20 rounded-full scale-95 group-hover:scale-100 transition-transform duration-700" />
                <img
                  className="w-48 h-48 md:w-[22vw] md:h-[22vw] rounded-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 shadow-2xl"
                  src="https://plus.unsplash.com/premium_photo-1674389991716-c85ddd942811?w=800"
                  alt="Pradeep Jartarghar"
                />
              </div>

              {/* TEXT COLUMN */}
              <div className="md:col-span-7 flex flex-col justify-center">
                <span className="text-[10px] tracking-[0.8em] text-[#C6A75E] uppercase mb-4 font-bold">
                  The Visionary
                </span>
                <h1 className="text-[clamp(2rem,5vw,4rem)] font-light mb-6 leading-tight">
                  <span className="text-[#C6A75E] font-serif italic mr-2 text-3xl md:text-5xl block md:inline mb-2">Meet</span>
                  Pradeep Jartarghar
                </h1>

                <p className="max-w-xl text-gray-400 text-base md:text-lg font-light leading-relaxed mb-8">
                  I am a wedding photographer dedicated to capturing real emotions, 
                  timeless traditions, and the unique story of every couple. 
                  My approach blends creativity with documentary storytelling.
                </p>

                <div className="flex items-center gap-6">
                  <button 
                    onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                    className="px-8 py-3 bg-[#C6A75E] text-black text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-white transition-colors"
                  >
                    Work With Me
                  </button>
                </div>
              </div>
            </div>

            {/* FLOATING DECORATIVE IMAGE */}
            <motion.img
              style={{ y: useTransform(scrollYProgress, [0.8, 1], [100, -100]) }}
              className="hidden lg:block absolute right-20 bottom-20 h-[12vw] rounded-2xl object-cover opacity-30 grayscale"
              src="https://plus.unsplash.com/premium_photo-1698162172991-af91a7b0ea21?w=600"
              alt="Decorative"
            />
          </div>

        </motion.div>

        {/* PROGRESS INDICATOR (FIXED ON SCREEN) */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4">
          {[0, 1, 2].map((i) => (
            <motion.div 
              key={i}
              className="h-[2px] rounded-full bg-white"
              style={{ 
                width: progressWidths[i],
                opacity: progressOpacities[i]
              }}
            />
          ))}
        </div>
      </div>
    </motion.section>
  );
}