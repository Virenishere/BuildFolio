import React from "react";
import { motion, Variants } from "framer-motion";

export const sentenceVariants: Variants = {
  hidden: {},
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export const letterVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { opacity: { duration: 0 } } },
};

interface TypewriterProps extends React.HTMLAttributes<HTMLParagraphElement> {
  text: string;
}

export const Typewriter: React.FC<TypewriterProps> = ({ text, ...rest }) => (
  <motion.p
    key={text}
    variants={sentenceVariants}
    initial="hidden"
    animate="visible"
    className="text-8xl font-semibold"
    {...rest}
  >
    {text.split("").map((char, i) => {
      let className = "";

      if (i >= 0 && i <= 5) className = "text-[var(--color-secondary-col)] dark:text-[var(--color-secondary-col)]"; // CREATE
      else if (i >= 7 && i <= 10) className = "text-black dark:text-white"; // YOUR
      else if (i >= 12) className = "text-[var(--color-secondary-col)] dark:text-var(--color-secondary-col)"; // RESUME

      return (
        <React.Fragment key={`${char}-${i}`}>
          <motion.span variants={letterVariants} className={className}>
            {char === " " ? "\u00A0" : char}
          </motion.span>
          {i === 11 && <br />}
        </React.Fragment>
      );
    })}
  </motion.p>
);
