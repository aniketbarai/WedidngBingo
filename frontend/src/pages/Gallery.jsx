import { useEffect, useState, useCallback } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("newest");
  const [selected, setSelected] = useState(null);
  const [myLikes, setMyLikes] = useState(() => JSON.parse(localStorage.getItem("user_likes") || "[]"));
  const [loading, setLoading] = useState(false);

  const fetchImages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/images?page=${page}&limit=12&sort=${sortBy}`);
      const data = await res.json();
      setImages(data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setTimeout(() => setLoading(false), 400);
    }
  }, [page, sortBy]);

  useEffect(() => {
    // const saved = JSON.parse(localStorage.getItem("user_likes") || "[]");
    // setMyLikes(saved);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchImages();
  }, [fetchImages]);

  const handleLike = async (id, e) => {
    if (e) e.stopPropagation();
    if (myLikes.includes(id)) return;
    try {
      const res = await fetch(`http://localhost:5000/like/${id}`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        const updatedLikes = [...myLikes, id];
        setMyLikes(updatedLikes);
        localStorage.setItem("user_likes", JSON.stringify(updatedLikes));
        setImages(prev => prev.map(img => img._id === id ? { ...img, likes: data.newLikes } : img));
        if (selected?._id === id) setSelected(prev => ({ ...prev, likes: data.newLikes }));
      }
    } catch (err) { console.error(err); }
  };

  const handleOpen = async (img) => {
    setSelected(img);
    try {
      const res = await fetch(`http://localhost:5000/click/${img._id}`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setImages(prev => prev.map(item => item._id === img._id ? { ...item, clicks: data.clicks } : item));
        setSelected(prev => ({ ...prev, clicks: data.clicks }));
      }
    } catch (err) { console.error(err); }
  };

  return (
    <div className="bg-white min-h-screen font-sans text-slate-900 selection:bg-blue-100">
      
      {/* MINIMAL NAV-SPACER */}
      <div className="h-24"></div>

      <main className="max-w-6xl mx-auto px-6 py-12">
        
        {/* HEADER SECTION */}
        <header className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900">Portrait Gallery</h1>
            <p className="text-slate-400 text-sm">GP Mumbai Student Archive • 2026 Edition</p>
          </div>

          <div className="flex p-1 bg-slate-100 rounded-lg">
            {["newest", "popular"].map((mode) => (
              <button
                key={mode}
                onClick={() => { setSortBy(mode); setPage(1); }}
                className={`px-6 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${
                  sortBy === mode ? "bg-white shadow-sm text-slate-900" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </header>

        {/* GRID SECTION */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-slate-50 animate-pulse rounded-xl"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-6 gap-y-10">
            {images.map((img) => (
              <motion.div
                key={img._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => handleOpen(img)}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-slate-100 shadow-sm transition-shadow hover:shadow-xl hover:shadow-slate-200/50">
                  <img 
                    src={img.src} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    alt="Portrait" 
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                </div>

                <div className="mt-4 flex items-center justify-between px-1">
                  <button 
                    onClick={(e) => handleLike(img._id, e)}
                    className={`flex items-center gap-1.5 transition-colors ${
                      myLikes.includes(img._id) ? 'text-rose-500' : 'text-slate-300 hover:text-slate-500'
                    }`}
                  >
                    <span className="text-base">{myLikes.includes(img._id) ? "❤️" : "🤍"}</span>
                    <span className="text-xs font-semibold">{img.likes}</span>
                  </button>
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter italic">
                    {img.clicks} Views
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* SIMPLE PAGINATION */}
        <footer className="mt-24 pt-12 border-t border-slate-100 flex items-center justify-between">
          <button 
            disabled={page === 1} 
            onClick={() => {setPage(page - 1); window.scrollTo({top:0, behavior:'smooth'})}}
            className="text-xs font-bold text-slate-400 hover:text-slate-900 disabled:opacity-0 transition-colors uppercase tracking-widest"
          >
            ← Previous
          </button>
          <span className="text-xs font-bold text-slate-900 tracking-widest uppercase">Page {page}</span>
          <button 
            onClick={() => {setPage(page + 1); window.scrollTo({top:0, behavior:'smooth'})}}
            className="text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest"
          >
            Next →
          </button>
        </footer>
      </main>

      {/* CLEAN MODAL */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/80 backdrop-blur-md z-[999] flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.98, y: 10 }} animate={{ scale: 1, y: 0 }}
              className="bg-white shadow-2xl rounded-3xl overflow-hidden max-w-sm w-full border border-slate-100"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="aspect-[3/4] w-full relative">
                <img src={selected.src} className="w-full h-full object-cover" />
                <button 
                  onClick={() => setSelected(null)}
                  className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-colors"
                >
                  ✕
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Entry ID</p>
                    <p className="text-sm font-mono text-slate-900">#{selected._id.slice(-6)}</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Likes</p>
                      <p className="text-sm font-bold text-rose-500">{selected.likes}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Views</p>
                      <p className="text-sm font-bold text-slate-900">{selected.clicks}</p>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => handleLike(selected._id)}
                  className={`w-full py-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                    myLikes.includes(selected._id) 
                    ? 'bg-rose-50 text-rose-500' 
                    : 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-200'
                  }`}
                >
                  {myLikes.includes(selected._id) ? "Liked Portrait" : "Like This Portrait"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}