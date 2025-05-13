import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { Moon, Sun, MoveUpRight } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { darkMode, toggleDarkMode } = useThemeStore();

  // Animation variants for the icons
  const iconVariants = {
    initial: { opacity: 0, rotate: -90, y: 10 },
    animate: {
      opacity: 1,
      rotate: 0,
      y: 0,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    exit: {
      opacity: 0,
      rotate: 90,
      y: -10,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  return (
    <header className="relative z-10 flex justify-between items-center w-full mb-8 px-16">
      <div className="cursor-pointer">
        <Link to="/">
          <span className="text-5xl">
            <span className="text-[var(--color-primary-col)] dark:text-[var(--color-bg-primary-col)] font-semibold">
              Build
            </span>
            <span className="text-[var(--color-secondary-col)] font-semibold">
              Folio
            </span>
          </span>
        </Link>
      </div>
      <nav className="hidden md:flex items-center space-x-14 text-gray-700 dark:text-gray-200">
        <Link
          to="/howitworks"
          className="relative group text-[var(--color-primary-col)] hover:text-[var(--color-primary-col-hover)] font-semibold"
        >
          How it Works
          <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-gray-500 transition-all group-hover:w-full"></span>
        </Link>
        <Link
          to="/features"
          className="relative group text-[var(--color-primary-col)] hover:text-[var(--color-primary-col-hover)] font-semibold"
        >
          Features
          <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-gray-500 transition-all group-hover:w-full"></span>
        </Link>
        <Link
          to="/aboutus"
          className="relative group text-[var(--color-primary-col)] hover:text-[var(--color-primary-col-hover)] font-semibold"
        >
          About Us
          <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-gray-500 transition-all group-hover:w-full"></span>
        </Link>
      </nav>

      <div className="flex items-center justify-center space-x-6">
        {/* Animated dark mode toggle button */}
        <Button
          className="bg-transparent hover:bg-[var(--color-primary-col-hover)]/20 text-black dark:text-white rounded-full border border-white dark:border-[var(--color-bg-primary-col)] cursor-pointer"
          onClick={toggleDarkMode}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={darkMode ? "sun" : "moon"}
              variants={iconVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {darkMode ? <Sun /> : <Moon />}
            </motion.div>
          </AnimatePresence>
        </Button>
        <Link to="/login">
        <Button className="bg-[var(--color-secondary-col)] hover:bg-[var(--color-secondary-col-hover)] w-36 h-12 cursor-pointer text-black font-semibold">
          Try Now <MoveUpRight />
        </Button>
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
