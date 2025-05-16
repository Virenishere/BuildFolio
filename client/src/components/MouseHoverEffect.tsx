import { useEffect, useState} from "react";
import { motion } from "framer-motion";
import { useCursorStore } from "@/store/useCursorStore";

const MouseHoverEffect = () => {
  const { mousePosition, cursorVariant, setMousePosition } = useCursorStore();
  const [isDarkMode, setIsDarkMode] = useState(false);

    // Detect system or Tailwind dark mode
  useEffect(() => {
    const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const updateDarkMode = () => {
      // Tailwind applies `dark` class on <html> or <body>, check that too
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    };

    updateDarkMode(); // run once

    darkQuery.addEventListener("change", updateDarkMode);
    const observer = new MutationObserver(updateDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => {
      darkQuery.removeEventListener("change", updateDarkMode);
      observer.disconnect();
    };
  }, []);



  // Mouse movement effect
  useEffect(() => {
    const handleMouseMove = (e:MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [setMousePosition]);


  const cursorColor = isDarkMode
    ? "rgba(255, 255, 255, 0.5)" // Light for dark background
    : "rgba(0, 0, 0, 0.5)";      // Dark for light background

  const cursorShadow = isDarkMode
    ? "0 0 4px rgba(255, 255, 255, 0.4)"
    : "0 0 4px rgba(0, 0, 0, 0.2)";
    

  const cursorVariants = {
    default: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      height: 32,
      width: 32,
      backgroundColor: cursorColor,
      boxShadow: cursorShadow,
      transition: { duration: 0.1 },
    },
    hover: {
      x: mousePosition.x - 30,
      y: mousePosition.y - 30,
      height: 60,
      width: 60,
      backgroundColor: cursorColor,
      boxShadow: cursorShadow,
      mixBlendMode: "difference",
      transition: { duration: 0.2 },
    },
  };

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 rounded-full opacity-30 pointer-events-none z-50 hidden md:block"
        variants={cursorVariants}
        animate={cursorVariant}
        initial="default" 
        
      />
    </>
  );
};

export default MouseHoverEffect;
