import React, { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

const IntroLoader = () => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let start = 0;
    const interval = setInterval(() => {
      // "Erratic" loading feels more alive/interesting than linear
      start += Math.floor(Math.random() * 5) + 1;
      if (start >= 100) {
        start = 100;
        clearInterval(interval);
        setTimeout(() => setIsVisible(false), 800);
      }
      setCount(start);
    }, 40);
    return () => clearInterval(interval);
  }, []);

  // Word splitting for individual letter physics
  const word = "BINGO";

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: { duration: 0.8, ease: "easeInOut" } 
          }}
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#050505] overflow-hidden"
        >
          {/* 1. DYNAMIC BACKGROUND PULSE */}
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute w-[600px] h-[600px] bg-[#C6A75E] rounded-full blur-[150px]"
          />

          {/* 2. THE MAIN "ENERGY" TEXT */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="flex gap-2 mb-4">
              {word.split("").map((letter, i) => (
                <motion.span
                  key={i}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={() => ({
                    y: Math.random() * 400 - 200, 
                    x: Math.random() * 400 - 200, 
                    rotate: Math.random() * 90,
                    opacity: 0,
                    filter: "blur(10px)"
                  })}
                  transition={{ 
                    duration: 0.8, 
                    delay: i * 0.05,
                    exit: { type: "spring", stiffness: 50 } 
                  }}
                  className="text-7xl md:text-9xl font-black text-white italic tracking-tighter"
                >
                  {letter}
                </motion.span>
              ))}
            </div>

            {/* 3. THE "GLITCH" COUNTER */}
            <motion.div 
              className="relative"
              exit={{ scale: 2, opacity: 0, filter: "blur(20px)" }}
            >
              <span className="text-[12rem] md:text-[18rem] font-black text-white/5 leading-none">
                {count}
              </span>
              <motion.div 
                className="absolute inset-0 flex items-center justify-center"
                animate={{ x: [-2, 2, -2] }}
                transition={{ repeat: Infinity, duration: 0.1 }}
              >
                 <span className="text-xl font-mono text-[#C6A75E] tracking-[1em] ml-6">
                    {count}%
                 </span>
              </motion.div>
            </motion.div>
          </div>

          {/* 4. THE "SHUTTER SPEED" LINES */}
          <div className="absolute inset-0 pointer-events-none">
             {[...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ 
                    scaleX: [0, 1, 0], 
                    opacity: [0, 0.2, 0],
                    x: ["-100%", "100%"] 
                  }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity, 
                    delay: i * 0.2,
                    ease: "linear"
                  }}
                  className="h-[1px] w-full bg-[#C6A75E] absolute"
                  style={{ top: `${i * 10}%` }}
                />
             ))}
          </div>

          {/* 5. VINTAGE NOISE OVERLAY */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.05] z-50" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
          }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroLoader;