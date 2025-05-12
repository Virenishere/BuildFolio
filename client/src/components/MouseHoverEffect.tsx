import { useEffect} from "react";
import { motion } from "framer-motion";
import { useCursorStore } from "@/store/useCursorStore";

const MouseHoverEffect = () => {
  const { mousePosition, cursorVariant, setMousePosition } = useCursorStore();

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

  const cursorVariants = {
    default: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      height: 32,
      width: 32,
      backgroundColor: "rgba(0, 0, 0, 0.5)", 
      transition: { duration: 0.1 }, 
    },
    hover: {
      x: mousePosition.x - 30,
      y: mousePosition.y - 30,
      height: 60,
      width: 60,
      backgroundColor: "rgba(0, 0, 0, 0.2)",
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
