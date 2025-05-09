import Background from "../assets/transparenthomapage.svg";
import { animate, motion, useMotionValue, useTransform } from "motion/react"
import { useEffect } from "react";
import { MoveUpRight } from "lucide-react";
import { Typewriter } from "@/components/Typewritter";


const text = {
  fontSize: 24,
  color: "#000",
}


const Home = () => {
  const count = useMotionValue(0)
    const rounded = useTransform(() => Math.round(count.get()))
    const displayText = useTransform(rounded, val => `${val}+`)

    useEffect(() => {
        const controls = animate(count, 100, { duration: 5 })
        return () => controls.stop()
    }, [])
  
  return (
    <motion.div className="min-h-screen">
      <img
        src={Background}
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        alt="background"
        draggable="false"
      />
      
      {/* first page - banner */}
      <motion.div className="relative flex justify-between z-10">
        <motion.div className="w-1/2 mt-24">
          <span className="text-8xl font-semibold">
            <Typewriter 
            text="CREATE YOUR RESUME"
            />
            <div className="flex items-center mt-16">
              <div className="flex flex-col items-center justify-center rounded-xl bg-[var(--color-purple-col)] w-48 h-32">
                <motion.pre style={text}>{displayText}</motion.pre>
                <span className="text-lg font-semibold">Resume Made</span> 
              </div>
              <div className="flex flex-col mx-2.5 mt-4">
                <span className="text-2xl font-medium ">Boost your </span><span className="text-2xl font-medium">Resume</span>
                <span className="text-base font-medium text-[var(--color-text-gray)]">Level Up Your Resume with AI</span>
                <button className="text-base font-semibold underline w-44 text-[var(--color-secondary-col)] flex flex-row cursor-pointer">Watch Demo <MoveUpRight /> </button>
              </div>
            </div>
          </span>
        </motion.div> 
        <motion.div className="flex items-center justify-center w-1/2 mt-36">
          <img src="https://images.pexels.com/photos/31965829/pexels-photo-31965829/free-photo-of-close-up-of-a-vintage-style-camera-with-red-strap.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="picture" style={{"height": "650px", "borderRadius":"10px" }}/>
        </motion.div> 
      </motion.div>

      {/* second page -marque and content */}
      
      
    </motion.div>
  );
};

export default Home;
