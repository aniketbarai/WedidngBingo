import { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import BASE_URL from "../config";

export default function GeminiContact() {
  const [formData, setFormData] = useState({ name: "", email: "", date: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/send-mail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      setStatus(data.success ? "SUCCESS" : "ERROR");
      if (data.success) setFormData({ name: "", email: "", date: "", message: "" });
    } catch { setStatus("ERROR"); }
    setLoading(false);
    setTimeout(() => setStatus(""), 4000);
  };

  return (
    <section id="contact" className="h-screen w-full bg-[#050505] text-[#f4f4f4] px-6 flex items-center justify-center overflow-hidden relative">
      
      {/* Background soft glow to prevent "dead" black space */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#C6A75E]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-5xl w-full grid lg:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* LEFT: MINIMAL TEXT */}
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            className="text-[10px] uppercase tracking-[0.6em] text-[#C6A75E] font-bold"
          >
            Connect
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="text-5xl lg:text-7xl font-light tracking-tighter leading-none"
          >
            Reserve Your <br /> 
            <span className="italic font-serif text-[#C6A75E]">Legacy.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-gray-500 text-sm font-light max-w-xs leading-relaxed"
          >
            Available for 2026 worldwide commissions.
          </motion.p>
        </div>

        {/* RIGHT: THE GEMINI ANIMATED FORM */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative p-[1px] rounded-[2.5rem] overflow-hidden group"
        >
          {/* THE GOLDEN STRIP ANIMATION (The "Gemini" Border) */}
          <div className="absolute inset-[-1000%] animate-[spin_5s_linear_infinite] bg-[conic-gradient(from_0deg,#C6A75E_0%,#000_20%,#000_80%,#C6A75E_100%)] opacity-40 group-hover:opacity-100 transition-opacity duration-500" />

          {/* INNER FORM CONTAINER */}
          <div className="relative bg-[#0a0a0a] rounded-[2.5rem] p-8 lg:p-12 space-y-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <input 
                  type="text" name="name" value={formData.name} required onChange={handleChange}
                  placeholder="NAME"
                  className="w-full bg-transparent border-b border-white/10 py-3 text-[10px] tracking-widest focus:outline-none focus:border-[#C6A75E] transition-all placeholder:text-gray-800"
                />
                <input 
                  type="date" name="date" value={formData.date} onChange={handleChange}
                  className="w-full bg-transparent border-b border-white/10 py-3 text-[10px] tracking-widest focus:outline-none focus:border-[#C6A75E] transition-all text-gray-600 uppercase"
                />
              </div>

              <input 
                type="email" name="email" value={formData.email} required onChange={handleChange}
                placeholder="EMAIL"
                className="w-full bg-transparent border-b border-white/10 py-3 text-[10px] tracking-widest focus:outline-none focus:border-[#C6A75E] transition-all placeholder:text-gray-800"
              />

              <textarea 
                name="message" rows="2" value={formData.message} required onChange={handleChange}
                placeholder="YOUR STORY"
                className="w-full bg-transparent border-b border-white/10 py-3 text-[10px] tracking-widest focus:outline-none focus:border-[#C6A75E] transition-all placeholder:text-gray-800 resize-none"
              />

              <div className="pt-4">
                <button 
                  type="submit" disabled={loading}
                  className="w-full py-4 rounded-2xl bg-[#C6A75E] text-black text-[10px] font-black uppercase tracking-[0.5em] hover:bg-white transition-all duration-500 disabled:opacity-50"
                >
                  {loading ? "..." : "Send Request"}
                </button>

                <AnimatePresence>
                  {status && (
                    <motion.p 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className={`text-center text-[9px] mt-6 tracking-[0.3em] font-bold uppercase ${status === 'SUCCESS' ? 'text-emerald-500' : 'text-rose-500'}`}
                    >
                      {status === 'SUCCESS' ? 'Message Received' : 'Error Occurred'}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </form>
          </div>
        </motion.div>
      </div>

      {/* Tailwind CSS for the rotation animation (Add this to your globals.css or a style tag) */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}