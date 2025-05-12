import Background from "../assets/transparenthomapage.svg"

import { animate, motion, useMotionValue, useTransform } from "motion/react"
import { useEffect, useState, useRef } from "react"
import { ChevronDown, MoveUpRight } from "lucide-react"
import { Typewriter } from "@/components/Typewritter"
import MouseHoverEffect from "@/components/MouseHoverEffect"
import { useCursorStore } from "@/store/useCursorStore"
import MarqueeAnimation from "@/components/MarqueeAnimation"

const Home = () => {
  const { handleMouseEnter, handleMouseLeave } = useCursorStore()
  const [scrolled, setScrolled] = useState(false)

  const count = useMotionValue(0)
  const rounded = useTransform(() => Math.round(count.get()))
  const displayText = useTransform(rounded, (val) => `${val}+`)

  const isHoveredRefs = useRef({})

  useEffect(() => {
    const controls = animate(count, 100, { duration: 5 })

    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      controls.stop()
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <>
      <motion.div
        className="min-h-screen px-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <MouseHoverEffect />

        <motion.img
          src={Background}
          className="absolute top-0 left-0 w-full h-100vh object-cover z-0 rounded-b-4xl border-b-1  shadow-lg"
          alt="background"
          draggable="false"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />

        {/* Scroll indicator */}
        <motion.div
          className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 flex flex-col items-center"
          animate={{
            y: scrolled ? 0 : [0, 10, 0], // Only animate y when not scrolled
            opacity: scrolled ? 0 : 1, // Hide when scrolled
          }}
          transition={{
            y: {
              repeat: scrolled ? 0 : Number.POSITIVE_INFINITY, // Stop repeating when scrolled
              duration: 1.5,
              ease: "easeInOut",
            },
            opacity: { duration: 0.3 },
          }}
        >
          <span className="text-lg font-semibold mb-2 text-gray-800">Scroll to explore</span>
          <ChevronDown className="w-5 h-5 text-gray-800" />
        </motion.div>

        {/* first page - banner */}
        <motion.div className="relative flex justify-between z-10">
          <motion.div
            className="w-1/2 mt-24"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span
              className="text-8xl font-semibold leading-tight"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <Typewriter text="CREATE YOUR RESUME" />
              <motion.div
                className="flex items-start mt-12 space-x-6"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.6 }}
              >
                <motion.div
                  className="flex flex-col items-center justify-center rounded-2xl bg-[var(--color-purple-col)] w-36 md:w-48 h-28 md:h-32 shadow-lg"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <motion.div className="text-2xl md:text-3xl font-bold">{displayText}</motion.div>
                  <span className="text-sm md:text-lg font-semibold mt-1">Resumes Made</span>
                </motion.div>

                <div className="flex flex-col mx-2.5 mt-3">
                  <span className="text-2xl font-medium ">Boost your </span>
                  <span className="text-2xl font-medium">Resume</span>
                  <span className="text-base font-medium text-[var(--color-text-gray)]">
                    Level Up Your Resume with AI
                  </span>

                  <motion.button
                    className="mt-1.5 text-base font-semibold flex items-center space-x-2 text-[var(--color-secondary-col)] group cursor-pointer leading-tight"
                    whileHover={{ x: 5 }}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <span className="underline">Watch Demo</span>
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{
                        repeat: Number.POSITIVE_INFINITY,
                        duration: 1.5,
                        ease: "easeInOut",
                      }}
                    >
                      <MoveUpRight className="w-4 h-4" />
                    </motion.div>
                  </motion.button>
                </div>
              </motion.div>
            </span>
          </motion.div>

          <motion.div
            className="flex items-center justify-center w-1/2 mt-36"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            whileHover={{ scale: 1.02 }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="relative w-full" style={{ height: "650px", maxWidth: "500px" }}>
              {/* Main image */}
              <motion.img
                src="https://images.pexels.com/photos/31965829/pexels-photo-31965829/free-photo-of-close-up-of-a-vintage-style-camera-with-red-strap.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="Resume showcase"
                className="rounded-2xl shadow-2xl object-cover w-full h-full"
                initial={{ filter: "brightness(0.8)" }}
                whileHover={{ filter: "brightness(1)" }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              />

              {/* Interactive colored elements */}
              {[
                { color: "#F87171", size: "w-16 h-16", position: "-top-6 -left-6", delay: 0.2, label: "Templates" },
                { color: "#4ADE80", size: "w-20 h-20", position: "top-1/4 -right-8", delay: 0.3, label: "AI Writer" },
                {
                  color: "#C084FC",
                  size: "w-24 h-24",
                  position: "bottom-1/3 -left-10",
                  delay: 0.4,
                  label: "Customize",
                },
                { color: "#FACC15", size: "w-16 h-16", position: "bottom-10 right-10", delay: 0.5, label: "Export" },
                { color: "#FB923C", size: "w-14 h-14", position: "-bottom-5 left-1/4", delay: 0.6, label: "Share" },
              ].map((item, index) => {
                const isHoveredRef = useRef(false)
                const [isHovered, setIsHovered] = useState(false)

                return (
                  <motion.div
                    key={index}
                    className={`absolute ${item.position} ${item.size} rounded-3xl flex items-center justify-center cursor-pointer overflow-hidden`}
                    style={{ backgroundColor: item.color }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                      delay: item.delay,
                    }}
                    whileHover={{
                      scale: 1.1,
                      boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                    }}
                    onHoverStart={() => {
                      isHoveredRef.current = true
                      setIsHovered(true)
                    }}
                    onHoverEnd={() => {
                      isHoveredRef.current = false
                      setIsHovered(false)
                    }}
                  >
                    <motion.div
                      className="absolute inset-0 flex flex-col items-center justify-center p-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isHovered ? 1 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="text-xs font-medium text-white text-center">{item.label}</span>
                      <div className="mt-1">
                        <MoveUpRight className="w-3 h-3 text-white" />
                      </div>
                    </motion.div>
                  </motion.div>
                )
              })}

              {/* Floating animation for the entire image */}
              <motion.div
                className="absolute inset-0 rounded-2xl"
                animate={{
                  boxShadow: ["0 0 0 rgba(0,0,0,0)", "0 20px 60px rgba(0,0,0,0.1)", "0 0 0 rgba(0,0,0,0)"],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* second page -marque and content */}
      <motion.div className="mt-9">
        <MarqueeAnimation />
      </motion.div>
    </>
  )
}

export default Home
