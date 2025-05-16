"use client";

import { useEffect, useRef } from "react";
import { motion, useAnimationControls, useInView } from "framer-motion";
import { Users, Award, Heart, Code } from "lucide-react";
import { Separator } from "@/components/ui/separator";

// Animation variants
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

const About: React.FC = () => {
  const teamRef = useRef<HTMLDivElement>(null);
  const teamInView = useInView(teamRef, { once: false, amount: 0.1 });

  const valuesRef = useRef<HTMLDivElement>(null);
  const valuesInView = useInView(valuesRef, { once: false, amount: 0.1 });

  const svgRef = useRef<HTMLDivElement>(null);
  const svgControls = useAnimationControls();
  const svgInView = useInView(svgRef, { amount: 0.2 });

  useEffect(() => {
    if (svgInView) {
      svgControls.start({
        scale: [1, 1.02, 1],
        transition: { duration: 2, repeat: Infinity, repeatType: "reverse" },
      });
    } else {
      svgControls.stop();
    }
  }, [svgInView, svgControls]);

  return (
    <div className="relative px-4 py-12 text-gray-800 dark:text-white overflow-hidden">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-5xl sm:text-6xl md:text-7xl font-medium mt-16 md:mt-24 text-center"
        >
          About <span className="text-[var(--color-primary-col)]">Build</span>
          <span className="text-[var(--color-secondary-col)]">Folio</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="mt-12 max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-800 p-8 md:p-12"
        >
          <Separator className="mb-8" />
          <p className="text-gray-800 dark:text-gray-200 text-lg md:text-xl leading-relaxed font-medium mb-6">
            <strong>BuildFolio</strong> is your personalized portfolio platform
            built to showcase your projects, skills, and achievements in a
            compelling way. Whether you're a developer, designer, or freelancer,
            BuildFolio helps you create a professional presence online.
          </p>
          <p className="text-gray-800 dark:text-gray-200 text-lg md:text-xl leading-relaxed font-medium mb-6">
            Our goal is to make it easier for individuals to build and present
            their portfolio without needing to start from scratch. BuildFolio
            offers flexible templates, interactive elements, and seamless
            integration to bring your story to life.
          </p>
          <p className="text-gray-800 dark:text-gray-200 text-lg md:text-xl leading-relaxed font-medium">
            Crafted with care and creativity, BuildFolio empowers you to turn
            your work into an impressive digital profile. Start showcasing what
            makes you unique and stand out from the crowd!
          </p>
          <Separator className="mt-8" />
        </motion.div>
      </div>

      {/* Our Values Section */}
      <motion.div
        ref={valuesRef}
        variants={containerVariants}
        initial="hidden"
        animate={valuesInView ? "visible" : "hidden"}
        className="mt-24 mx-auto max-w-7xl"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-12 px-2 text-center">
          Our Values
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Value 1 */}
          <motion.div variants={itemVariants}>
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-violet-600 dark:text-violet-400" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Community First
                </h3>
                <p className="text-base md:text-lg font-medium text-gray-600 dark:text-gray-300">
                  We believe in building a space where creators can share,
                  learn, and grow together. BuildFolio supports collaboration
                  and highlights the power of community.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Value 2 */}
          <motion.div variants={itemVariants}>
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                <Award className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Excellence in Design
                </h3>
                <p className="text-base md:text-lg font-medium text-gray-600 dark:text-gray-300">
                  Every portfolio should reflect its creator. That’s why
                  BuildFolio prioritizes clean, beautiful, and modern design to
                  match your professionalism.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Value 3 */}
          <motion.div variants={itemVariants}>
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                <Heart className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Passion for Creativity
                </h3>
                <p className="text-base md:text-lg font-medium text-gray-600 dark:text-gray-300">
                  Creativity drives us. From animations to custom sections,
                  BuildFolio encourages you to express your individuality with
                  every click and scroll.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Value 4 */}
          <motion.div variants={itemVariants}>
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center flex-shrink-0">
                <Code className="w-6 h-6 text-rose-600 dark:text-rose-400" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Innovation at Heart
                </h3>
                <p className="text-base md:text-lg font-medium text-gray-600 dark:text-gray-300">
                  BuildFolio is more than a template — it's a dynamic tool built
                  to evolve with you. We strive to stay ahead with the latest in
                  web tech and user experience.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Floating elements for visual interest */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1] overflow-hidden">
        <motion.div
          className="absolute w-64 h-64 rounded-full bg-violet-300/10 dark:bg-violet-700/10"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          style={{ top: "10%", left: "5%" }}
        />
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-emerald-300/10 dark:bg-emerald-700/10"
          animate={{
            x: [0, -150, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          style={{ top: "30%", right: "10%" }}
        />
      </div>
    </div>
  );
};

export default About;
