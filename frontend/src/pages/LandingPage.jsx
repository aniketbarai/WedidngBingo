import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion, useScroll, useTransform } from "framer-motion";

const LandingPage = () => {
  const { scrollY } = useScroll();

  // Parallax effect for background
  const yBg = useTransform(scrollY, [0, 500], [0, 150]);

  // Fade text slightly while scrolling
  const opacityText = useTransform(scrollY, [0, 300], [1, 0]);

  // 🔥 Scroll to Testimonials
  const handleScrollToTestimonials = () => {
    const section = document.getElementById("testimonials");

    if (section) {
      window.scrollTo({
        top: section.offsetTop,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      id="home"
      data-scroll
      data-scroll-speed="-1.3"
      className="relative h-screen w-full overflow-hidden"
    >
      {/* Parallax Background */}
      <motion.div
        style={{ y: yBg }}
        className="absolute inset-0"
      >
        <img
          src="https://images.unsplash.com/photo-1519741497674-611481863552"
          alt="Wedding"
          className="w-full h-[120%] object-cover"
        />
        <div className="absolute inset-0 bg-black/60"></div>
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ opacity: opacityText }}
        className="relative z-10 flex flex-col items-center justify-center text-center h-screen px-6"
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-white leading-tight">
          Capturing Love,
          <span className="block text-[#C6A75E]">
            One Moment at a Time
          </span>
        </h1>

        <p className="mt-6 text-gray-300 text-lg md:text-xl font-light max-w-2xl">
          Luxury Wedding Photography that tells your timeless love story.
        </p>

        {/* BUTTON */}
        <div className="mt-8 flex gap-6 flex-wrap justify-center">
          <button
            onClick={handleScrollToTestimonials}
            className="px-8 py-3 bg-[#C6A75E] text-black rounded-full font-medium hover:scale-105 transition duration-300"
          >
            View Testimonials
          </button>
        </div>
      </motion.div>
    </section>
  );
};

export default LandingPage;