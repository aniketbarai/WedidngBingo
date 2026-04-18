// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Aarav & Meera",
    text: "Choosing this team was the best decision of our wedding. Every picture feels magical and full of emotion.",
    image: "https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?w=400&q=80",
    location: "Udaipur"
  },
  {
    name: "Kabir & Isha",
    text: "Professional, warm, and incredibly talented. They delivered memories we’ll cherish forever.",
    image: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=400&q=80",
    location: "Mumbai"
  },
  {
    name: "Rohan & Ananya",
    text: "The cinematic film brought tears to our eyes. It felt like watching our own love story in a movie.",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&q=80",
    location: "Goa"
  },
  {
    name: "Vikram & Sneha",
    text: "Their eye for detail is unmatched. Everything was documented with such grace and artistry.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    location: "Jaipur"
  }
];

// Duplicate the list to create a seamless infinite loop
const doubleTestimonials = [...testimonials, ...testimonials];

export default function TestimonialSection() {
  return (
    <section id="testimonials" className="bg-[#050505] text-white py-32 overflow-hidden relative">
      
      {/* SECTION HEADER */}
      <div className="max-w-7xl mx-auto px-6 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <span className="text-[10px] tracking-[0.8em] text-[#C6A75E] uppercase font-bold mb-4 block">
            The Gallery of Praise
          </span>
          <h2 className="text-5xl md:text-8xl font-extralight tracking-tighter leading-none mb-6">
            Loved by <span className="italic font-serif text-[#C6A75E]">Souls.</span>
          </h2>
          <div className="h-[1px] w-24 bg-[#C6A75E] mx-auto opacity-50" />
        </motion.div>
      </div>

      {/* INFINITE SCROLLING MARQUEE */}
      <div className="relative flex">
        <motion.div 
          className="flex gap-8 pr-8"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ 
            ease: "linear", 
            duration: 30, 
            repeat: Infinity 
          }}
        >
          {doubleTestimonials.map((item, index) => (
            <div 
              key={index} 
              className="w-[350px] md:w-[450px] flex-none group cursor-pointer"
            >
              <div className="h-full bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-10 backdrop-blur-sm transition-all duration-700 group-hover:bg-[#C6A75E]/5 group-hover:border-[#C6A75E]/20 group-hover:-translate-y-2">
                
                {/* Visual Accent */}
                <div className="w-8 h-[1px] bg-[#C6A75E] mb-8 group-hover:w-16 transition-all duration-700" />
                
                <p className="text-gray-400 text-lg md:text-xl font-light leading-relaxed mb-10 italic font-serif">
                  "{item.text}"
                </p>

                <div className="flex items-center gap-4">
                  <div className="overflow-hidden rounded-full w-12 h-12 border border-[#C6A75E]/30 group-hover:border-[#C6A75E] transition-colors">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium tracking-wide group-hover:text-[#C6A75E] transition-colors">
                      {item.name}
                    </h4>
                    <p className="text-[9px] text-gray-600 uppercase tracking-widest mt-1">
                      {item.location} • Signature Couple
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* AMBIENT BACKGROUND GLOW */}
      <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-full h-64 bg-[#C6A75E]/5 blur-[120px] rounded-full pointer-events-none" />

      {/* SATISFACTION TAG */}
      <div className="mt-20 text-center relative z-10">
        <motion.div 
           initial={{ scale: 0.9, opacity: 0 }}
           whileInView={{ scale: 1, opacity: 1 }}
           className="inline-block px-6 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl"
        >
          <p className="text-[10px] text-gray-400 uppercase tracking-[0.4em]">
            Over <span className="text-white">150+</span> Stories Captured Globally
          </p>
        </motion.div>
      </div>
    </section>
  );
}