
import { useEffect, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import {
  ArrowRight,
  Globe,
  Shield,
  Sparkles,
} from "lucide-react";
import resumebenefitSVG from "../assets/resumebenefit.svg"

const Features = () => {
    const benefitsRef = useRef(null);
  const benefitsInView = useInView(benefitsRef, {
    triggerOnce: false,
    threshold: 0.1,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const svgRef = useRef(null);
  const svgControls = useAnimation();
  const svgInViewRef = useRef(null);
  const svgInView = useInView(svgInViewRef, { threshold: 0.2 });

  useEffect(() => {
    if (svgInView) {
      svgControls.start({
        scale: [1, 1.02, 1],
        transition: { duration: 2, repeat: Infinity, repeatType: "reverse" },
      });
    }
  }, [svgInView, svgControls]);

  return (
    <div className="relative px-4 py-12 text-gray-800 dark:text-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-5xl sm:text-6xl md:text-7xl font-medium mt-16 md:mt-24 text-center"
        >
          Why Choose  About <span className="text-[var(--color-primary-col)]">Build</span><span className="text-[var(--color-secondary-col)]">Folio</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="font-medium text-xl sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 mt-8 max-w-3xl mx-auto text-center"
        >
          Discover how BuildFolio transforms the way you capture, organize, and develop your ideas.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
        className="mt-16 mx-auto max-w-2xl"
      >
        <div ref={svgInViewRef} className="relative h-64 md:h-80">
          <motion.div
            ref={svgRef}
            animate={svgControls}
            className="w-full h-full transition-transform duration-300 ease-out"
          >
            <img src={resumebenefitSVG} alt="Benefits" className="w-full h-full object-contain" />
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        ref={benefitsRef}
        variants={containerVariants}
        initial="hidden"
        animate={benefitsInView ? "visible" : "hidden"}
        className="mt-24 mx-auto max-w-7xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Existing cards (1 to 4)... */}

          {/* Card 5 - Global Access */}
          <motion.div variants={itemVariants}>
            <motion.div
              whileHover={{
                y: -8,
                boxShadow:
                  "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-blue-200 dark:border-blue-800/30 h-full"
            >
              <div className="p-6">
                <motion.div
                  className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Globe className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Access Anywhere</h3>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">Work from any device</p>
                <p className="font-medium text-gray-600 dark:text-gray-300">
                  Your ideas are with you wherever you go. Cloud-syncing ensures your notes are always up-to-date and accessible.
                </p>
                <div className="mt-4">
                  <button className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
                    Learn more{" "}
                    <ArrowRight className="h-4 w-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Card 6 - Security */}
          <motion.div variants={itemVariants}>
            <motion.div
              whileHover={{
                y: -8,
                boxShadow:
                  "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800/30 h-full"
            >
              <div className="p-6">
                <motion.div
                  className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-900/30 flex items-center justify-center mb-4"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Shield className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Secure by Design</h3>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">Your data is safe</p>
                <p className="font-medium text-gray-600 dark:text-gray-300">
                  We prioritize your privacy with end-to-end encryption and secure data storage, so you can focus on your work with peace of mind.
                </p>
                <div className="mt-4">
                  <button className="inline-flex items-center text-sm font-medium text-slate-600 dark:text-slate-400 hover:underline">
                    Learn more{" "}
                    <ArrowRight className="h-4 w-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Card 7 - Smart Suggestions */}
          <motion.div variants={itemVariants}>
            <motion.div
              whileHover={{
                y: -8,
                boxShadow:
                  "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-fuchsia-200 dark:border-fuchsia-800/30 h-full"
            >
              <div className="p-6">
                <motion.div
                  className="w-12 h-12 rounded-full bg-fuchsia-100 dark:bg-fuchsia-900/30 flex items-center justify-center mb-4"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Sparkles className="w-6 h-6 text-fuchsia-600 dark:text-fuchsia-400" />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Smart Suggestions</h3>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">AI-powered insights</p>
                <p className="font-medium text-gray-600 dark:text-gray-300">
                  Our intelligent engine offers recommendations and connections based on your content — helping you stay ahead with fresh ideas.
                </p>
                <div className="mt-4">
                  <button className="inline-flex items-center text-sm font-medium text-fuchsia-600 dark:text-fuchsia-400 hover:underline">
                    Learn more{" "}
                    <ArrowRight className="h-4 w-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
export default Features;



