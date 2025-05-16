import { useEffect, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import steponeSVG from "../assets/stepone.svg";
import steptwoSVG from "../assets/steptwo.svg";
import stepthreeSVG from "../assets/stepthree.svg";
import stepfourSVG from "../assets/stepfour.svg";

const HowItWorks = () => {
  // Intersection observers for scroll animations
  const stepsRef = useRef(null);
  const stepsInView = useInView(stepsRef, {
    triggerOnce: false,
    threshold: 0.1,
  });

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

  // SVG animation controls
  const svgOneRef = useRef(null);
  const svgTwoRef = useRef(null);
  const svgThreeRef = useRef(null);
  const svgFourRef = useRef(null);

  const svgOneControls = useAnimation();
  const svgTwoControls = useAnimation();
  const svgThreeControls = useAnimation();
  const svgFourControls = useAnimation();

  const svgOneInViewRef = useRef(null);
  const svgTwoInViewRef = useRef(null);
  const svgThreeInViewRef = useRef(null);
  const svgFourInViewRef = useRef(null);

  const svgOneInView = useInView(svgOneInViewRef, { threshold: 0.2 });
  const svgTwoInView = useInView(svgTwoInViewRef, { threshold: 0.2 });
  const svgThreeInView = useInView(svgThreeInViewRef, { threshold: 0.2 });
  const svgFourInView = useInView(svgFourInViewRef, { threshold: 0.2 });

  // SVG interactive animations
  useEffect(() => {
    if (svgOneInView) {
      svgOneControls.start({
        scale: [1, 1.02, 1],
        transition: { duration: 2, repeat: Infinity, repeatType: "reverse" },
      });
    }

    if (svgTwoInView) {
      svgTwoControls.start({
        rotate: [0, 2, 0, -2, 0],
        transition: { duration: 4, repeat: Infinity, repeatType: "reverse" },
      });
    }

    if (svgThreeInView) {
      svgThreeControls.start({
        y: [0, -10, 0],
        transition: { duration: 3, repeat: Infinity, repeatType: "reverse" },
      });
    }

    if (svgFourInView) {
      svgFourControls.start({
        filter: ["brightness(1)", "brightness(1.1)", "brightness(1)"],
        transition: { duration: 2.5, repeat: Infinity, repeatType: "reverse" },
      });
    }
  }, [
    svgOneInView,
    svgTwoInView,
    svgThreeInView,
    svgFourInView,
    svgOneControls,
    svgTwoControls,
    svgThreeControls,
    svgFourControls,
  ]);

  // Parallax effect for step cards
  const calculateParallax = (e: React.MouseEvent, strength = 20) => {
    const { currentTarget, clientX, clientY } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();

    const x = (clientX - left) / width - 0.5;
    const y = (clientY - top) / height - 0.5;

    return {
      transform: `perspective(1000px) rotateX(${y * strength}deg) rotateY(${
        -x * strength
      }deg)`,
    };
  };

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
          How It{" "}
          <span className="text-[var(--color-secondary-col)]">Works</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="font-medium text-xl sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 mt-8 max-w-3xl mx-auto text-center"
        >
          BuildFolio makes capturing and organizing your thoughts effortless
          with our simple four-step process.
        </motion.p>
      </div>

      {/* Steps Section */}
      <motion.div
        ref={stepsRef}
        variants={containerVariants}
        initial="hidden"
        animate={stepsInView ? "visible" : "hidden"}
        className="mt-24 mx-auto max-w-7xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Step 1 */}
          <motion.div variants={itemVariants} className="relative">
            <div className="absolute -left-4 -top-4 w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center z-10">
              <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                1
              </span>
            </div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/30 dark:to-emerald-900/20 border border-emerald-200 dark:border-emerald-800/30 shadow-sm p-8 h-full"
              onMouseMove={(e) => {
                const { transform } = calculateParallax(e, 5);
                if (svgOneRef.current) {
                  (svgOneRef.current as HTMLElement).style.transform =
                    transform;
                }
              }}
            >
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Fill in Your Details
              </h3>
              <p className="text-base md:text-lg font-medium text-gray-600 dark:text-gray-300 mb-6">
                Simply fill in your personal details, career experience,
                education, and skills on the website to get started.
              </p>
              <div
                ref={svgOneInViewRef}
                className="flex items-center justify-center h-48 md:h-64 relative"
              >
                <motion.div
                  ref={svgOneRef}
                  animate={svgOneControls}
                  className="w-full h-full transition-transform duration-300 ease-out"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <img
                    src={steponeSVG}
                    alt="Capture"
                    className="w-full h-full object-contain"
                  />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* Step 2 */}
          <motion.div variants={itemVariants} className="relative">
            <div className="absolute -left-4 -top-4 w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center z-10">
              <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                2
              </span>
            </div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="rounded-3xl overflow-hidden bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/20 border border-amber-200 dark:border-amber-800/30 shadow-sm p-8 h-full"
              onMouseMove={(e) => {
                const { transform } = calculateParallax(e, 5);
                if (svgTwoRef.current) {
                  (svgTwoRef.current as HTMLElement).style.transform =
                    transform;
                }
              }}
            >
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                AI-Powered Analysis
              </h3>
              <p className="text-base md:text-lg font-medium text-gray-600 dark:text-gray-300 mb-6">
                Our advanced AI will analyze your resume for ATS compatibility,
                ensuring it meets industry standards and is optimized for job
                applications.
              </p>
              <div
                ref={svgTwoInViewRef}
                className="flex items-center justify-center h-48 md:h-64 relative"
              >
                <motion.div
                  ref={svgTwoRef}
                  animate={svgTwoControls}
                  className="w-full h-full transition-transform duration-300 ease-out"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <img
                    src={steptwoSVG}
                    alt="Organize"
                    className="w-full h-full object-contain"
                  />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* Step 3 */}
          <motion.div variants={itemVariants} className="relative">
            <div className="absolute -left-4 -top-4 w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center z-10">
              <span className="text-2xl font-bold text-rose-600 dark:text-rose-400">
                3
              </span>
            </div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="rounded-3xl overflow-hidden bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-950/30 dark:to-rose-900/20 border border-rose-200 dark:border-rose-800/30 shadow-sm p-8 h-full"
              onMouseMove={(e) => {
                const { transform } = calculateParallax(e, 5);
                if (svgThreeRef.current) {
                  (svgThreeRef.current as HTMLElement).style.transform =
                    transform;
                }
              }}
            >
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Receive Tailored Suggestions
              </h3>
              <p className="text-base md:text-lg font-medium text-gray-600 dark:text-gray-300 mb-6">
                The AI provides personalized suggestions to improve your resume,
                making it stronger, more relevant, and better suited for job
                opportunities.
              </p>
              <div
                ref={svgThreeInViewRef}
                className="flex items-center justify-center h-48 md:h-64 relative"
              >
                <motion.div
                  ref={svgThreeRef}
                  animate={svgThreeControls}
                  className="w-full h-full transition-transform duration-300 ease-out"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <img
                    src={stepthreeSVG}
                    alt="Connect"
                    className="w-full h-full object-contain"
                  />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* Step 4 */}
          <motion.div variants={itemVariants} className="relative">
            <div className="absolute -left-4 -top-4 w-12 h-12 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center z-10">
              <span className="text-2xl font-bold text-violet-600 dark:text-violet-400">
                4
              </span>
            </div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="rounded-3xl overflow-hidden bg-gradient-to-br from-violet-50 to-violet-100 dark:from-violet-950/30 dark:to-violet-900/20 border border-violet-200 dark:border-violet-800/30 shadow-sm p-8 h-full"
              onMouseMove={(e) => {
                const { transform } = calculateParallax(e, 5);
                if (svgFourRef.current) {
                  (svgFourRef.current as HTMLElement).style.transform =
                    transform;
                }
              }}
            >
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Download Your Optimized Resume
              </h3>
              <p className="text-base md:text-lg font-medium text-gray-600 dark:text-gray-300 mb-6">
                Once your resume is optimized, easily download it in your
                preferred format (PDF or DOCX) and be ready to submit to
                potential employers.
              </p>
              <div
                ref={svgFourInViewRef}
                className="flex items-center justify-center h-48 md:h-64 relative"
              >
                <motion.div
                  ref={svgFourRef}
                  animate={svgFourControls}
                  className="w-full h-full transition-transform duration-300 ease-out"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <img
                    src={stepfourSVG}
                    alt="Revisit"
                    className="w-full h-full object-contain"
                  />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
        className="mt-24 mb-16 mx-auto max-w-7xl text-center"
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-6">
          Ready to transform how you capture ideas?
        </h2>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link to="/login">
            <button className="inline-flex items-center justify-center rounded-md bg-[var(--color-primary-col)] hover:bg-[var(--color-primary-col-hover)] px-4 py-2 text-sm font-medium text-white shadow transition-colors h-10 cursor-pointer">
              Get Started Now <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </Link>
        </motion.div>
      </motion.div>

      {/* Floating elements for visual interest */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1] overflow-hidden">
        <motion.div
          className="absolute w-64 h-64 rounded-full bg-emerald-300/10 dark:bg-emerald-700/10"
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
          className="absolute w-96 h-96 rounded-full bg-violet-300/10 dark:bg-violet-700/10"
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

export default HowItWorks;
