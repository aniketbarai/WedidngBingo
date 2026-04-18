import { useState, useRef } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence, useInView } from "framer-motion";

const packagesData = {
  photo: [
    { 
      title: "The Essential Collection", 
      price: 75000, 
      features: ["8 Hours Coverage", "300+ Artistically Edited Photos", "Online Gallery for 1 Year", "Physical Photo Box"], 
      popular: false 
    },
    { 
      title: "The Signature Experience", 
      price: 125000, 
      features: ["Full Day Coverage", "2 Senior Photographers", "600+ Edited Photos", "Luxury Flush Mount Album", "Pre-Wedding Session"], 
      popular: true 
    },
    { 
      title: "The Grand Archive", 
      price: 185000, 
      features: ["Full Team Coverage", "1000+ Master Photos", "Cinematic Portraits", "4K Drone Aerials", "Handcrafted Heirloom Album"], 
      popular: false 
    },
  ],
  video: [
    { 
      title: "Cinematic Film", 
      price: 95000, 
      features: ["Single Cinematographer", "4K Video Production", "3-Min Teaser Film", "Full Highlight Reel"], 
      popular: false 
    },
    { 
      title: "Luxury Cinema", 
      price: 165000, 
      features: ["2 Cinematographers", "Documentary Wedding Film", "Aerial Drone Shots", "Instagram Cinematic Reel", "Same-Day Edit Teaser"], 
      popular: true 
    },
  ],
  complete: [
    { 
      title: "The Masterpiece Collection", 
      price: 225000, 
      features: ["Full Photo + Video Team", "Advanced Drone Coverage", "Signature Luxury Album", "Complete Cinematic Film", "Personalized Keepsake Box", "Same-Day Photo Highlights"], 
      popular: true 
    },
  ],
};

const addons = [
  { item: "Extra Photographer", price: "₹15,000" },
  { item: "Pre-Wedding Film", price: "₹25,000" },
  { item: "Same-Day Edit", price: "₹20,000" },
  { item: "Fine-Art Print Box", price: "₹12,000" }
];

export default function PackagesSection() {
  const [activeTab, setActiveTab] = useState("photo");
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  // SMOOTH SCROLL FUNCTION
  const scrollToContact = () => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section ref={sectionRef} className="relative py-32 px-6 bg-[#050505] text-white overflow-hidden min-h-screen flex flex-col justify-center">
      
      {/* BACKGROUND GLOW */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl bg-[#C6A75E]/5 blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        
        {/* HEADER */}
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            className="text-[10px] uppercase tracking-[0.5em] text-[#C6A75E] font-bold block mb-4"
          >
            Invest in Memories
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-extralight tracking-tighter mb-6"
          >
            Bespoke <span className="italic font-serif text-[#C6A75E]">Collections.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            className="text-gray-500 max-w-lg mx-auto font-light text-sm tracking-wide leading-relaxed"
          >
            Crafted for those who value the art of storytelling. Each collection is a commitment to preserving your legacy.
          </motion.p>
        </div>

        {/* TAB TOGGLE */}
        <div className="flex justify-center mb-20">
          <div className="inline-flex bg-white/5 backdrop-blur-xl p-1.5 rounded-full border border-white/10 relative">
            {["photo", "video", "complete"].map((type) => (
              <button
                key={type}
                onClick={() => setActiveTab(type)}
                className={`relative z-10 px-8 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors duration-500 ${
                  activeTab === type ? "text-black" : "text-gray-400 hover:text-white"
                }`}
              >
                {type}
                {activeTab === type && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-[#C6A75E] rounded-full -z-10"
                    transition={{ type: "spring", bounce: 0.15, duration: 0.6 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* PACKAGE CARDS */}
        <div className="flex flex-wrap justify-center gap-8 lg:gap-10">
          <AnimatePresence mode="sync">
            {packagesData[activeTab].map((pkg, index) => (
              <motion.div
                key={activeTab + index}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative w-full md:w-[calc(50%-2rem)] lg:w-[calc(33.33%-2.5rem)] max-w-sm p-10 rounded-[2.5rem] border transition-all duration-700 group ${
                  pkg.popular 
                    ? "border-[#C6A75E]/40 bg-gradient-to-b from-[#111] to-[#050505] shadow-[0_20px_50px_rgba(198,167,94,0.1)]" 
                    : "border-white/5 bg-white/[0.02] hover:border-white/20"
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#C6A75E] text-black text-[9px] font-black px-4 py-1.5 rounded-full tracking-widest uppercase shadow-lg">
                    Studio Signature
                  </div>
                )}

                <h3 className="text-xl font-light tracking-tight mb-2 group-hover:text-[#C6A75E] transition-colors">{pkg.title}</h3>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-3xl font-light text-[#C6A75E]">₹{pkg.price.toLocaleString()}</span>
                  <span className="text-[10px] text-gray-600 uppercase tracking-tighter">Invest</span>
                </div>

                <div className="h-[1px] w-full bg-gradient-to-r from-[#C6A75E]/40 to-transparent mb-8" />

                <ul className="space-y-4 mb-12 min-h-[180px]">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-xs font-light text-gray-400">
                      <span className="text-[#C6A75E] mt-1.5 w-1 h-1 rounded-full bg-[#C6A75E]" />
                      <span className="hover:text-white transition-colors">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={scrollToContact}
                  className="w-full py-4 rounded-2xl bg-transparent border border-[#C6A75E]/30 text-[#C6A75E] text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#C6A75E] hover:text-black transition-all duration-500 active:scale-95"
                >
                  Secure Your Date
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* CUSTOMIZE SECTION */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-24 pt-12 border-t border-white/5"
        >
          <p className="text-[10px] uppercase tracking-[0.4em] text-gray-600 mb-10 text-center">Customize Your Experience</p>
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-8">
            {addons.map((addon, i) => (
              <div key={i} className="flex items-center gap-4 group cursor-default">
                <span className="text-[#C6A75E] text-xl font-serif italic">+</span>
                <div className="flex flex-col">
                  <span className="text-[11px] font-light text-gray-400 group-hover:text-white transition-colors tracking-wide">{addon.item}</span>
                  <span className="text-[9px] text-gray-700 font-bold tracking-widest mt-1">{addon.price}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* SCANNER LINE */}
        <div className="mt-28 text-center">
            <div className="h-[1px] max-w-xs mx-auto bg-white/10 relative overflow-hidden">
                <motion.div 
                    initial={{ x: "-100%" }}
                    animate={isInView ? { x: "100%" } : {}}
                    transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C6A75E]/60 to-transparent w-1/2"
                />
            </div>
            <p className="mt-6 text-[9px] text-gray-600 uppercase tracking-[0.5em] font-medium">
               Committed to <span className="text-gray-300">Excellence</span> & Timeless Artistry
            </p>
        </div>

      </div>
    </section>
  );
}