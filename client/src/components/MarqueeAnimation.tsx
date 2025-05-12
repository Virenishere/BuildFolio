"use client"

import { motion } from "motion/react"
import { useCursorStore } from "@/store/useCursorStore"

const MarqueeAnimation = () => {
  const { handleMouseEnter, handleMouseLeave } = useCursorStore()

  const marqueeVariants = {
    animate: {
      x: [0, -2000],
      transition: {
        x: {
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "loop",
          duration: 20,
          ease: "linear",
        },
      },
    },
  }

  const marqueeVariantsReverse = {
    animate: {
      x: [-2000, 0],
      transition: {
        x: {
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "loop",
          duration: 20,
          ease: "linear",
        },
      },
    },
  }

  const words = ["INNOVATIVE", "DYNAMIC", "VISIONARY", "POLISHED", "VERSATILE", "AUTHENTIC", "DISTINCTIVE", "IMPACTFUL"]

  return (
    <div className="overflow-hidden py-12 bg-[var(--color-purple-col)]/10">
      <div className="flex flex-col gap-4">
        <motion.div
          className="flex whitespace-nowrap"
          variants={marqueeVariants}
          animate="animate"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {[...Array(2)].map((_, dupeIndex) => (
            <div key={dupeIndex} className="flex">
              {words.map((word, index) => (
                <div key={`${word}-${index}-${dupeIndex}`} className="text-6xl font-bold mx-8 cursor-pointer">
                  {word}
                  <span className="text-[var(--color-secondary-col)]">.</span>
                </div>
              ))}
            </div>
          ))}
        </motion.div>

        <motion.div
          className="flex whitespace-nowrap"
          variants={marqueeVariantsReverse}
          animate="animate"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {[...Array(2)].map((_, dupeIndex) => (
            <div key={dupeIndex} className="flex">
              {words.reverse().map((word, index) => (
                <div key={`${word}-${index}-${dupeIndex}`} className="text-6xl font-bold mx-8 cursor-pointer">
                  {word}
                  <span className="text-[var(--color-primary-col)]">.</span>
                </div>
              ))}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

export default MarqueeAnimation
