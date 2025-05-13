import Background from "../assets/transparenthomapage.svg"
import bannerimgSVG from "../assets/bannerimg.svg"

import { animate, motion, useMotionValue, useTransform } from "motion/react"
import { useEffect, useState } from "react"
import { ChevronDown, MoveUpRight, ArrowRight, Users, FileText, Award } from "lucide-react"
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

  const [isHoveredStates, setIsHoveredStates] = useState({})
  const [hoveredIndices, setHoveredIndices] = useState({})

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
        className="px-16 py-8"
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
                src={bannerimgSVG}
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
                const isHovered = hoveredIndices[index] || false

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
                      setHoveredIndices((prev) => ({ ...prev, [index]: true }))
                    }}
                    onHoverEnd={() => {
                      setHoveredIndices((prev) => ({ ...prev, [index]: false }))
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
      <motion.div className="mt-48">
        <MarqueeAnimation />
      </motion.div>

      {/* New modern component below marquee */}
      <motion.section
        className="py-24 px-16 bg-gradient-to-b from-white to-gray-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Section header */}
          <motion.div
            className="text-center mb-16"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.h2
              className="text-5xl font-bold mb-4"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Elevate Your Career Journey
            </motion.h2>
            <motion.p
              className="text-xl text-gray-600 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              Our AI-powered platform transforms your professional experience into a compelling resume that gets noticed
              by employers.
            </motion.p>
          </motion.div>

          {/* Features grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">
            {[
              {
                icon: <FileText className="w-8 h-8" />,
                title: "Smart Templates",
                description: "Choose from dozens of ATS-optimized templates designed by hiring professionals.",
                color: "#F87171",
                delay: 0.1,
              },
              {
                icon: <Award className="w-8 h-8" />,
                title: "AI Resume Enhancement",
                description: "Our AI analyzes and enhances your resume to highlight your strengths and achievements.",
                color: "#4ADE80",
                delay: 0.2,
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Industry Insights",
                description: "Get personalized recommendations based on your industry and career level.",
                color: "#C084FC",
                delay: 0.3,
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: feature.delay }}
                viewport={{ once: true }}
                whileHover={{
                  y: -10,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
                }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <motion.div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                  style={{ backgroundColor: feature.color }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="text-white">{feature.icon}</div>
                </motion.div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-6">{feature.description}</p>
                <motion.button
                  className="flex items-center text-[var(--color-secondary-col)] font-medium"
                  whileHover={{ x: 5 }}
                >
                  <span className="mr-2">Learn more</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </motion.div>
            ))}
          </div>

          {/* Testimonial section */}
          <motion.div
            className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-3xl p-12 relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {/* Decorative elements */}
            <motion.div
              className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-purple-100 opacity-50"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 15, 0],
              }}
              transition={{
                duration: 8,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            />
            <motion.div
              className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-blue-100 opacity-40"
              animate={{
                scale: [1, 1.3, 1],
                rotate: [0, -20, 0],
              }}
              transition={{
                duration: 10,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            />

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
              <motion.div
                className="md:w-1/3"
                initial={{ x: -30, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="relative">
                  <motion.img
                    src="https://images.pexels.com/photos/3771807/pexels-photo-3771807.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                    alt="Satisfied customer"
                    className="w-full h-80 object-cover rounded-2xl shadow-lg"
                    whileHover={{ scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 300, damping: 10 }}
                  />
                  <motion.div
                    className="absolute -bottom-5 -right-5 bg-white rounded-xl p-3 shadow-lg"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10, delay: 0.4 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <motion.svg
                          key={star}
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="#FACC15"
                          stroke="#FACC15"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.4 + star * 0.1 }}
                        >
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </motion.svg>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              <motion.div
                className="md:w-2/3"
                initial={{ x: 30, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <motion.p
                  className="text-2xl italic mb-6 text-gray-700"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  "After struggling for months to get interviews, I used this platform to rebuild my resume. Within two
                  weeks, I had three interview requests from top companies in my industry. The AI suggestions were
                  spot-on for my field."
                </motion.p>
                <div>
                  <h4 className="text-xl font-bold">Sarah Johnson</h4>
                  <p className="text-gray-600">Senior Product Manager at TechCorp</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            className="mt-20 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.h3
              className="text-4xl font-bold mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Ready to transform your resume?
            </motion.h3>
            <motion.p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who've accelerated their job search with our AI-powered platform.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <motion.button
                className="px-8 py-4 bg-[var(--color-secondary-col)] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              <motion.button
                className="px-8 py-4 border-2 border-gray-300 rounded-xl font-semibold hover:border-gray-400 flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <span>View Sample Resumes</span>
                <MoveUpRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section
        className="py-24 px-16 bg-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.h2
              className="text-5xl font-bold mb-4"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              How It Works
            </motion.h2>
            <motion.p
              className="text-xl text-gray-600 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              Create a professional resume in minutes with our easy three-step process
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              {
                step: "01",
                title: "Choose a Template",
                description:
                  "Browse our collection of professionally designed templates tailored for different industries and career levels.",
                color: "#F87171",
                delay: 0.1,
              },
              {
                step: "02",
                title: "Add Your Details",
                description:
                  "Fill in your information or import from LinkedIn. Our AI will help enhance your content for maximum impact.",
                color: "#4ADE80",
                delay: 0.2,
              },
              {
                step: "03",
                title: "Download & Share",
                description:
                  "Export your resume in multiple formats (PDF, DOCX, TXT) or share directly with employers via a custom link.",
                color: "#C084FC",
                delay: 0.3,
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                className="relative"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: step.delay }}
                viewport={{ once: true }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <motion.div
                  className="text-8xl font-bold opacity-10 absolute -top-10 -left-4"
                  style={{ color: step.color }}
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 0.1 }}
                  transition={{ duration: 0.5, delay: step.delay + 0.2 }}
                  viewport={{ once: true }}
                >
                  {step.step}
                </motion.div>
                <motion.div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                  style={{ backgroundColor: step.color }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="text-white text-2xl font-bold">{step.step}</div>
                </motion.div>
                <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Pricing Section */}
      <motion.section
        className="py-24 px-16 bg-gradient-to-b from-gray-50 to-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.h2
              className="text-5xl font-bold mb-4"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Simple, Transparent Pricing
            </motion.h2>
            <motion.p
              className="text-xl text-gray-600 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              Choose the plan that fits your needs. All plans include access to our AI resume enhancement tools.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Basic",
                price: "Free",
                description: "Perfect for creating a single resume",
                features: ["1 Resume", "5 Templates", "Basic AI Enhancement", "PDF Export", "Email Support"],
                cta: "Get Started",
                popular: false,
                color: "#F3F4F6",
                delay: 0.1,
              },
              {
                name: "Pro",
                price: "$12",
                period: "/month",
                description: "Ideal for active job seekers",
                features: [
                  "Unlimited Resumes",
                  "All Templates",
                  "Advanced AI Enhancement",
                  "All Export Formats",
                  "Cover Letter Builder",
                  "Priority Support",
                ],
                cta: "Start Free Trial",
                popular: true,
                color: "#C084FC",
                delay: 0,
              },
              {
                name: "Enterprise",
                price: "$29",
                period: "/month",
                description: "For teams and career professionals",
                features: [
                  "Everything in Pro",
                  "Team Collaboration",
                  "Custom Branding",
                  "API Access",
                  "Dedicated Account Manager",
                  "Training & Onboarding",
                ],
                cta: "Contact Sales",
                popular: false,
                color: "#F3F4F6",
                delay: 0.1,
              },
            ].map((plan, index) => (
              <motion.div
                key={index}
                className={`rounded-2xl p-8 ${
                  plan.popular
                    ? "bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-[var(--color-purple-col)] shadow-xl relative z-10 md:-mt-4 md:-mb-4"
                    : "bg-white border border-gray-200 shadow-lg"
                }`}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: plan.delay }}
                viewport={{ once: true }}
                whileHover={{
                  y: -10,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
                }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[var(--color-purple-col)] text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-end mb-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-gray-600 ml-1">{plan.period}</span>}
                </div>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <motion.li
                      key={featureIndex}
                      className="flex items-center"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: plan.delay + 0.1 + featureIndex * 0.05 }}
                      viewport={{ once: true }}
                    >
                      <svg
                        className="w-5 h-5 text-green-500 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span>{feature}</span>
                    </motion.li>
                  ))}
                </ul>
                <motion.button
                  className={`w-full py-3 rounded-xl font-semibold ${
                    plan.popular
                      ? "bg-[var(--color-secondary-col)] text-white"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {plan.cta}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* FAQ Section */}
      <motion.section
        className="py-24 px-16 bg-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.h2
              className="text-5xl font-bold mb-4"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Frequently Asked Questions
            </motion.h2>
            <motion.p
              className="text-xl text-gray-600 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              Everything you need to know about our resume builder
            </motion.p>
          </motion.div>

          <div className="space-y-6">
            {[
              {
                question: "How does the AI resume enhancement work?",
                answer:
                  "Our AI analyzes your resume content and provides suggestions to improve clarity, impact, and keyword optimization. It identifies achievements, recommends stronger action verbs, and helps tailor your resume to specific job descriptions.",
              },
              {
                question: "Can I create multiple versions of my resume?",
                answer:
                  "Yes! With our Pro and Enterprise plans, you can create unlimited versions of your resume tailored to different job applications. Even with our Free plan, you can create one resume and make edits to it as needed.",
              },
              {
                question: "Is my data secure?",
                answer:
                  "Absolutely. We use industry-standard encryption and security practices to protect your personal information. We never share your data with third parties without your explicit consent.",
              },
              {
                question: "Can I cancel my subscription anytime?",
                answer:
                  "Yes, you can cancel your subscription at any time. If you cancel, you'll continue to have access to your paid features until the end of your billing period.",
              },
              {
                question: "Do you offer refunds?",
                answer:
                  "We offer a 14-day money-back guarantee if you're not satisfied with our service. Simply contact our support team within 14 days of your purchase.",
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                className="border border-gray-200 rounded-xl overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <details className="group">
                  <summary className="flex justify-between items-center font-semibold cursor-pointer p-6 text-xl">
                    <span>{faq.question}</span>
                    <span className="transition group-open:rotate-180">
                      <svg
                        fill="none"
                        height="24"
                        shapeRendering="geometricPrecision"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        viewBox="0 0 24 24"
                        width="24"
                      >
                        <path d="M6 9l6 6 6-6"></path>
                      </svg>
                    </span>
                  </summary>
                  <motion.div
                    className="px-6 pb-6 text-gray-600"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {faq.answer}
                  </motion.div>
                </details>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        className="py-24 px-16 bg-gradient-to-r from-purple-50 to-indigo-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "100K+", label: "Resumes Created", delay: 0 },
              { value: "85%", label: "Interview Success Rate", delay: 0.1 },
              { value: "200+", label: "Templates", delay: 0.2 },
              { value: "24/7", label: "Customer Support", delay: 0.3 },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: stat.delay }}
                viewport={{ once: true }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <motion.div
                  className="text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-secondary-col)] to-[var(--color-purple-col)]"
                  initial={{ scale: 0.8 }}
                  whileInView={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 10, delay: stat.delay + 0.2 }}
                  viewport={{ once: true }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-gray-700 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
     
      </motion.section>
    </>
  )
}

export default Home
