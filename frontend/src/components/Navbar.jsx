import React, { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, LogOut, LayoutDashboard, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [showNavbar, setShowNavbar] = useState(true);
    const [darkText, setDarkText] = useState(false);
    const [isLoggedIn] = useState(() => !!localStorage.getItem("token"));

    const navLinks = [
        { name: "Home", link: "/" },
        { name: "About", link: "/about" },
        { name: "Packages", link: "/packages" },
        { name: "Services", link: "/services" },
        { name: "Gallery", link: "/gallery" },
        { name: "Contact", link: "/contact" },
    ];

    useEffect(() => {
        let lastScrollY = window.scrollY;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setScrolled(currentScrollY > 20);

            // Hide navbar on scroll down, show on scroll up
            if (window.innerWidth >= 1024) {
                if (currentScrollY > lastScrollY && currentScrollY > 100) {
                    setShowNavbar(false);
                } else {
                    setShowNavbar(true);
                }
            }
            lastScrollY = currentScrollY;

            // Section color detection
            const lightSections = document.querySelectorAll("[data-light]");
            let isLight = false;
            const triggerPoint = 80; // Detect color near the top

            lightSections.forEach((section) => {
                const rect = section.getBoundingClientRect();
                if (rect.top <= triggerPoint && rect.bottom >= triggerPoint) {
                    isLight = true;
                }
            });
            setDarkText(isLight);
        };

        // const token = localStorage.getItem("token");
        // setIsLoggedIn(!!token); // Removed to avoid setState in effect

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.reload();
    };

    return (
        <nav
            className={`fixed w-full z-[100] transition-all duration-700 ease-in-out py-3 sm:py-5
            ${showNavbar ? "translate-y-0" : "-translate-y-full"} 
            ${scrolled ? "backdrop-blur-xl shadow-2xl py-2 sm:py-3" : "bg-transparent"} 
            ${darkText ? "text-slate-900" : "text-white"}`}
        >
            <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
                
                {/* 🎨 Premium Logo */}
                <Link to="/" className="group flex items-center gap-2">
                    <h1 className={`text-2xl sm:text-3xl font-serif tracking-tighter transition-colors duration-500 ${
                        darkText ? "text-black" : "text-[#C6A75E]"
                    }`}>
                        Wedding<span className={darkText ? "text-slate-500" : "text-white"}>Bingo</span>
                    </h1>
                </Link>

                {/* 🧭 Desktop Links */}
                <ul className="hidden lg:flex gap-10 font-medium text-xs uppercase tracking-[0.2em]">
                    {navLinks.map((item, index) => (
                        <motion.li key={index} whileHover={{ y: -1 }} className="relative group overflow-hidden">
                            <Link to={item.link} className="hover:opacity-70 transition-opacity duration-300">
                                {item.name}
                            </Link>
                            <span className={`absolute left-0 bottom-0 w-0 h-[1px] transition-all duration-500 group-hover:w-full ${
                                darkText ? "bg-black" : "bg-[#C6A75E]"
                            }`} />
                        </motion.li>
                    ))}
                </ul>

                {/* 🔐 Auth & CTA */}
                <div className="hidden lg:flex items-center gap-8">
                    {!isLoggedIn ? (
                        <Link to="/login" className="hover:scale-110 transition-transform duration-300">
                            <User size={20} className={darkText ? "text-black" : "text-[#C6A75E]"} />
                        </Link>
                    ) : (
                        <div className="flex items-center gap-5">
                            <Link to="/dashboard">
                                <LayoutDashboard size={20} className={darkText ? "text-black" : "text-[#C6A75E]"} />
                            </Link>
                            <button onClick={handleLogout} className="text-red-500/80 hover:text-red-500">
                                <LogOut size={20} />
                            </button>
                        </div>
                    )}

                    <button className={`group relative px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest overflow-hidden transition-all duration-500
                        ${darkText 
                            ? "bg-black text-white hover:shadow-xl" 
                            : "border border-[#C6A75E] text-[#C6A75E] hover:bg-[#C6A75E] hover:text-black"}`}>
                        <span className="relative z-10 flex items-center gap-2">
                            Inquiry Now <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </span>
                    </button>
                </div>

                {/* 📱 Mobile Toggle */}
                <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className="lg:hidden p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* 📱 Full-Screen Mobile Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        className="fixed inset-0 h-screen w-full bg-black flex flex-col items-center justify-center z-[101]"
                    >
                        <button 
                            onClick={() => setIsOpen(false)}
                            className="absolute top-8 right-8 text-white/50 hover:text-white"
                        >
                            <X size={40} strokeWidth={1} />
                        </button>

                        <div className="flex flex-col gap-6 text-center">
                            {navLinks.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Link
                                        to={item.link}
                                        onClick={() => setIsOpen(false)}
                                        className="text-4xl sm:text-5xl font-serif italic text-white hover:text-[#C6A75E] transition-colors"
                                    >
                                        {item.name}
                                    </Link>
                                </motion.div>
                            ))}
                        </div>

                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="mt-20 flex gap-8 text-[#C6A75E]"
                        >
                            <Link to="/login" onClick={() => setIsOpen(false)}><User size={24}/></Link>
                            {isLoggedIn && <button onClick={handleLogout}><LogOut size={24}/></button>}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;