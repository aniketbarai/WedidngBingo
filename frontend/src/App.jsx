import { Routes, Route } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import AboutSection from "./components/AboutSection";
import ContactPage from "./pages/ContactPage";
import Services from "./components/ServicesSection";
import Gallery from "./pages/Gallery";
import IntroLoader from "./pages/IntroLoader";
import PackagesSection from "./components/PackageSection";

function App() {
  const hasLoaded = useRef(false); // 🔥 KEY FIX
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hasLoaded.current) {
      hasLoaded.current = true;

      const timer = setTimeout(() => {
        setLoading(false);
      }, 3000);

      return () => clearTimeout(timer);
    } else {
      // 🚫 Prevent loader on navigation
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <IntroLoader />;
  }

  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutSection />} />
        <Route path="/packages" element={<PackagesSection />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </>
  );
}

export default App;