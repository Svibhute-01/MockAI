import React from 'react'
import Navbar from '../components/Navbar'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import {
  BsRobot,
  BsBarChart,
  BsClock,
  BsFileEarmarkText,
  BsArrowRight,
} from 'react-icons/bs'
import { HiSparkles } from 'react-icons/hi'

const features = [
  {
    title: 'AI Mock Interviews',
    icon: <BsRobot />,
    desc: 'Practice realistic interview scenarios powered by AI.',
  },
  {
    title: 'Performance Analytics',
    icon: <BsBarChart />,
    desc: 'Get detailed insights and improve with every session.',
  },
  {
    title: 'Timed Sessions',
    icon: <BsClock />,
    desc: 'Simulate real interview environments with timers.',
  },
  {
    title: 'Resume Evaluation',
    icon: <BsFileEarmarkText />,
    desc: 'Receive AI-based feedback to strengthen your resume.',
  },
]

function Home() {
  const { userData } = useSelector((state) => state.user)

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />

      <section className="max-w-7xl mx-auto px-6 lg:px-10 pt-20 pb-28">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-5 py-2 rounded-full text-sm font-medium mb-8"
          >
            <HiSparkles size={16} />
            AI Powered Smart Interview Platform
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold leading-tight tracking-tight text-gray-900"
          >
            Practice Interviews With
            <br />

            {/* Focus Animated Text */}
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{
                opacity: 1,
                scale: [1, 1.03, 1],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="relative inline-block mt-4"
            >
              <span
                className="bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500
                bg-clip-text text-transparent"
              >
                AI Intelligence
              </span>

              <motion.span
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.2, delay: 0.6 }}
                className="absolute left-0 -bottom-3 h-2 bg-green-100 rounded-full -z-10"
              />
            </motion.span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-8 text-lg md:text-xl text-gray-600 leading-relaxed max-w-3xl"
          >
            Prepare smarter with AI-driven mock interviews, instant feedback,
            resume evaluation, and performance analytics designed to help you
            succeed.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-10 flex flex-col sm:flex-row items-center gap-4"
          >
            <button className="bg-green-600 hover:bg-green-700 transition-all duration-300 text-white px-8 py-3.5 rounded-xl font-medium flex items-center gap-2 shadow-sm hover:shadow-md">
              Start Practicing
              <BsArrowRight />
            </button>

            <button className="border border-gray-300 hover:border-gray-400 px-8 py-3.5 rounded-xl font-medium text-gray-700 transition-all duration-300">
              Explore Features
            </button>
          </motion.div>

          {/* Welcome Text */}
          {userData && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-8 text-gray-500"
            >
              Welcome back,
              <span className="font-semibold text-gray-800 ml-1">
                {userData?.name}
              </span>
            </motion.p>
          )}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-24">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ y: -6 }}
              className="border border-gray-200 rounded-2xl p-6 bg-white hover:shadow-lg transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center text-xl mb-5">
                {feature.icon}
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>

              <p className="text-gray-600 leading-relaxed text-sm">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home
