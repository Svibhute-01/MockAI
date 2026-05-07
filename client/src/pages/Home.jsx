import React, { useEffect, useRef, useState } from 'react'
import Navbar from '../components/Navbar'
import { useSelector } from 'react-redux'
import { motion, useScroll, useTransform, AnimatePresence, useInView } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  BsRobot,
  BsBarChart,
  BsClock,
  BsFileEarmarkText,
  BsArrowRight,
  BsStarFill,
  BsCheckCircleFill,
  BsPlayCircle,
} from 'react-icons/bs'
import { HiSparkles } from 'react-icons/hi'
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from 'react-icons/md'
import Footer from '../components/Footer'

/* ─── DATA ─────────────────────────────────────────────────────────────── */
const features = [
  {
    title: 'AI Mock Interviews',
    icon: <BsRobot size={22} />,
    desc: 'Practice realistic interview scenarios powered by cutting-edge AI that adapts to your responses in real time.',
    color: 'from-emerald-400 to-teal-500',
    bg: 'bg-emerald-50',
    accent: 'text-emerald-600',
    stat: '10k+ sessions',
  },
  {
    title: 'Performance Analytics',
    icon: <BsBarChart size={22} />,
    desc: 'Detailed dashboards reveal your strengths, blind spots, and progress trajectory across every interview dimension.',
    color: 'from-sky-400 to-blue-500',
    bg: 'bg-sky-50',
    accent: 'text-sky-600',
    stat: '50+ metrics',
  },
  {
    title: 'Timed Sessions',
    icon: <BsClock size={22} />,
    desc: 'Simulate real pressure with configurable timers, pacing guides, and interview-day stress scenarios.',
    color: 'from-violet-400 to-purple-500',
    bg: 'bg-violet-50',
    accent: 'text-violet-600',
    stat: '5 modes',
  },
  {
    title: 'Resume Evaluation',
    icon: <BsFileEarmarkText size={22} />,
    desc: 'Upload your resume and receive precise, actionable AI feedback aligned to your target role.',
    color: 'from-rose-400 to-pink-500',
    bg: 'bg-rose-50',
    accent: 'text-rose-600',
    stat: '3× better callbacks',
  },
]

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Software Engineer @ Google',
    avatar: 'PS',
    text: 'This platform transformed my interview prep. The AI feedback was incredibly precise and helped me land my dream role.',
    stars: 5,
  },
  {
    name: 'Arjun Mehta',
    role: 'Product Manager @ Microsoft',
    avatar: 'AM',
    text: 'The timed sessions made me so comfortable under pressure. I walked into my final round completely confident.',
    stars: 5,
  },
  {
    name: 'Sneha Patel',
    role: 'Data Analyst @ Amazon',
    avatar: 'SP',
    text: 'Resume evaluation alone was worth it. Got 3× more callbacks after applying the suggestions.',
    stars: 5,
  },
]

const stats = [
  { value: '50K+', label: 'Interviews Conducted' },
  { value: '94%', label: 'Success Rate' },
  { value: '200+', label: 'Company Templates' },
  { value: '4.9★', label: 'User Rating' },
]

/* ─── HELPERS ───────────────────────────────────────────────────────────── */
function SectionLabel({ children }) {
  return (
    <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-5">
      <HiSparkles size={13} />
      {children}
    </div>
  )
}

function AnimatedCounter({ target }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const numericTarget = parseInt(target.replace(/\D/g, ''))

  useEffect(() => {
    if (!inView) return
    let start = 0
    const duration = 1800
    const step = Math.ceil(numericTarget / (duration / 16))
    const timer = setInterval(() => {
      start += step
      if (start >= numericTarget) { setCount(numericTarget); clearInterval(timer) }
      else setCount(start)
    }, 16)
    return () => clearInterval(timer)
  }, [inView, numericTarget])

  const suffix = target.replace(/[0-9]/g, '')
  return <span ref={ref}>{count}{suffix}</span>
}

/* ─── MARQUEE STRIP ─────────────────────────────────────────────────────── */
function MarqueeStrip() {
  const items = ['AI Mock Interviews', 'Resume Evaluation', 'Performance Analytics', 'Timed Sessions', 'Real Feedback', 'Career Growth']
  const doubled = [...items, ...items]
  return (
    <div className="overflow-hidden bg-green-600 py-3 my-0">
      <motion.div
        className="flex gap-12 whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        {doubled.map((item, i) => (
          <span key={i} className="text-white text-sm font-medium flex items-center gap-3">
            <BsCheckCircleFill size={12} className="text-green-300" />
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

/* ─── MAIN COMPONENT ────────────────────────────────────────────────────── */
function Home() {
  const { userData } = useSelector((state) => state.user)
  const navigate = useNavigate()
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [activeFeature, setActiveFeature] = useState(0)

  // Auto-advance testimonials
  useEffect(() => {
    const t = setInterval(() => setActiveTestimonial(p => (p + 1) % testimonials.length), 4000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="min-h-screen bg-[#fafaf9] text-gray-900 overflow-x-hidden font-sans">
      <Navbar />

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">

        {/* Animated mesh background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-white via-green-50/60 to-teal-50/40" />
          {/* Floating orbs */}
          <motion.div
            className="absolute top-20 right-1/4 w-96 h-96 rounded-full bg-green-200/30 blur-3xl"
            animate={{ scale: [1, 1.15, 1], x: [0, 20, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-32 left-1/4 w-80 h-80 rounded-full bg-teal-200/30 blur-3xl"
            animate={{ scale: [1, 1.2, 1], y: [0, -20, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          />
          <motion.div
            className="absolute top-1/2 left-10 w-56 h-56 rounded-full bg-emerald-100/40 blur-2xl"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: 'linear-gradient(#000 1px,transparent 1px),linear-gradient(90deg,#000 1px,transparent 1px)', backgroundSize: '60px 60px' }}
          />
        </div>

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="max-w-7xl mx-auto px-6 lg:px-10 pt-32 pb-20 w-full"
        >
          <div className="flex flex-col items-center text-center max-w-5xl mx-auto">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-white/80 backdrop-blur border border-green-200 text-green-700 px-5 py-2 rounded-full text-sm font-semibold mb-8 shadow-sm"
            >
              <HiSparkles size={16} className="text-green-500" />
              AI Powered Smart Interview Platform
              <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">New</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="text-5xl md:text-[4.5rem] lg:text-[5.5rem] font-extrabold leading-[1.05] tracking-tight text-gray-900"
              style={{ fontFamily: "'Sora', 'DM Sans', sans-serif" }}
            >
              Ace Every Interview
              <br />
              <span className="relative">
                <span className="bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
                  with AI Precision
                </span>
                {/* underline squiggle */}
                <motion.svg
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.2, delay: 0.8 }}
                  className="absolute -bottom-3 left-0 w-full"
                  viewBox="0 0 400 12" fill="none"
                >
                  <motion.path
                    d="M2 8 Q50 2 100 8 Q150 14 200 8 Q250 2 300 8 Q350 14 398 8"
                    stroke="url(#g)" strokeWidth="3" strokeLinecap="round"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ duration: 1.2, delay: 0.8 }}
                  />
                  <defs>
                    <linearGradient id="g" x1="0" y1="0" x2="400" y2="0">
                      <stop offset="0%" stopColor="#16a34a" />
                      <stop offset="100%" stopColor="#0d9488" />
                    </linearGradient>
                  </defs>
                </motion.svg>
              </span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.8 }}
              className="mt-10 text-lg md:text-xl text-gray-500 leading-relaxed max-w-2xl"
            >
              Prepare smarter with AI-driven mock interviews, instant feedback,
              resume evaluation, and performance analytics — all built to help you land the job.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mt-10 flex flex-col sm:flex-row items-center gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/interview')}
                className="group relative bg-green-600 hover:bg-green-700 text-white px-9 py-4 rounded-2xl font-semibold flex items-center gap-2.5 shadow-lg shadow-green-200 transition-all duration-300 overflow-hidden"
              >
                <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                Start Practicing Free
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <BsArrowRight />
                </motion.span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2.5 border border-gray-200 hover:border-green-300 hover:text-green-700 bg-white px-9 py-4 rounded-2xl font-semibold text-gray-700 transition-all duration-300 shadow-sm"
              >
                <BsPlayCircle size={20} className="text-green-500" />
                Watch Demo
              </motion.button>
            </motion.div>

            {/* Welcome back */}
            {userData && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="mt-7 text-gray-400 text-sm"
              >
                Welcome back,{' '}
                <span className="font-semibold text-gray-700">{userData?.name}</span> 👋
              </motion.p>
            )}

            {/* Social proof avatars */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="mt-12 flex items-center gap-4"
            >
              <div className="flex -space-x-3">
                {['#16a34a', '#0d9488', '#2563eb', '#7c3aed', '#dc2626'].map((c, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: c, zIndex: 5 - i }}>
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500">
                <span className="font-semibold text-gray-800">50,000+</span> candidates already practicing
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-9 rounded-full border-2 border-gray-300 flex items-start justify-center pt-1.5"
          >
            <div className="w-1.5 h-2.5 bg-gray-400 rounded-full" />
          </motion.div>
          <span className="text-xs text-gray-400">scroll</span>
        </motion.div>
      </section>

      {/* ── MARQUEE ───────────────────────────────────────────────────── */}
      <MarqueeStrip />

      {/* ── STATS ─────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-4xl font-extrabold text-green-600 mb-1 tabular-nums"
                style={{ fontFamily: "'Sora', sans-serif" }}>
                <AnimatedCounter target={s.value} />
              </div>
              <div className="text-sm text-gray-500 font-medium">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FEATURES SLIDER ───────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
        <div className="text-center mb-16">
          <SectionLabel>Platform Features</SectionLabel>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight"
            style={{ fontFamily: "'Sora', sans-serif" }}
          >
            Everything you need to succeed
          </motion.h2>
          <p className="text-gray-500 mt-4 max-w-xl mx-auto">
            Four powerful tools working together to turn you into the ideal candidate.
          </p>
        </div>

        {/* Tab selectors */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {features.map((f, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveFeature(i)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                activeFeature === i
                  ? 'bg-green-600 text-white shadow-md shadow-green-200'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-green-300'
              }`}
            >
              {f.icon} {f.title}
            </motion.button>
          ))}
        </div>

        {/* Sliding feature panel */}
        <div className="relative overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl min-h-[340px]">
          <AnimatePresence mode="wait">
            {features.map((f, i) =>
              i === activeFeature ? (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -60 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 flex flex-col md:flex-row"
                >
                  {/* Left */}
                  <div className="flex-1 p-10 md:p-14 flex flex-col justify-center">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white bg-gradient-to-br ${f.color} mb-6 shadow-lg`}>
                      {f.icon}
                    </div>
                    <h3 className="text-3xl font-extrabold mb-4" style={{ fontFamily: "'Sora', sans-serif" }}>
                      {f.title}
                    </h3>
                    <p className="text-gray-500 leading-relaxed text-lg max-w-md">{f.desc}</p>
                    <div className="mt-8 flex items-center gap-4">
                      <span className={`text-sm font-bold px-4 py-1.5 rounded-full ${f.bg} ${f.accent}`}>
                        {f.stat}
                      </span>
                      <button
                        onClick={() => navigate('/interview')}
                        className="text-green-600 font-semibold text-sm flex items-center gap-1 hover:gap-2.5 transition-all"
                      >
                        Try it now <BsArrowRight />
                      </button>
                    </div>
                  </div>
                  {/* Right decorative */}
                  <div className={`hidden md:flex flex-1 items-center justify-center bg-gradient-to-br ${f.color} bg-opacity-10 p-10`}>
                    <motion.div
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="w-48 h-48 rounded-3xl bg-white/30 backdrop-blur flex items-center justify-center shadow-2xl"
                    >
                      <span className="text-white text-8xl opacity-80">{f.icon}</span>
                    </motion.div>
                  </div>
                </motion.div>
              ) : null
            )}
          </AnimatePresence>
          {/* Arrow nav */}
          <div className="absolute bottom-5 right-5 flex gap-2">
            {[MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight].map((Icon, d) => (
              <button key={d} onClick={() => setActiveFeature(p => (p + (d === 0 ? -1 : 1) + features.length) % features.length)}
                className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-green-100 text-gray-600 hover:text-green-700 flex items-center justify-center transition-all">
                <Icon size={20} />
              </button>
            ))}
          </div>
          {/* Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {features.map((_, i) => (
              <button key={i} onClick={() => setActiveFeature(i)}
                className={`rounded-full transition-all duration-300 ${i === activeFeature ? 'w-6 h-2 bg-green-500' : 'w-2 h-2 bg-gray-300'}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────────── */}
      <section className="bg-gray-950 text-white py-28 px-6 overflow-hidden relative">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-green-500/10 blur-3xl rounded-full" />

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-green-900/40 border border-green-800 text-green-400 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-5">
              <HiSparkles size={13} /> How It Works
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight" style={{ fontFamily: "'Sora', sans-serif" }}>
              Three steps to your dream job
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Create Your Profile', desc: 'Tell us your target role, experience level, and which skills to focus on.' },
              { step: '02', title: 'Practice & Get Feedback', desc: 'Run AI interviews and receive deep, role-specific feedback after every session.' },
              { step: '03', title: 'Track & Improve', desc: 'Watch your analytics improve over time as you master every interview dimension.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15, duration: 0.7 }}
                viewport={{ once: true }}
                className="relative p-8 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/8 hover:border-green-500/40 transition-all duration-300 group"
              >
                <div className="text-7xl font-black text-white/5 group-hover:text-green-500/10 transition-colors absolute top-6 right-6"
                  style={{ fontFamily: "'Sora', sans-serif" }}>
                  {item.step}
                </div>
                <div className="w-10 h-10 rounded-xl bg-green-500/20 text-green-400 flex items-center justify-center font-bold text-sm mb-6">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Connector line (desktop) */}
          <div className="hidden md:block absolute top-[11.5rem] left-1/2 -translate-x-1/2 w-[55%] h-px bg-gradient-to-r from-transparent via-green-500/30 to-transparent" />
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-28">
        <div className="text-center mb-14">
          <SectionLabel>Success Stories</SectionLabel>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight" style={{ fontFamily: "'Sora', sans-serif" }}>
            Loved by candidates worldwide
          </h2>
        </div>

        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTestimonial}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl mx-auto text-center px-6"
            >
              {/* Stars */}
              <div className="flex justify-center gap-1 mb-6">
                {[...Array(testimonials[activeTestimonial].stars)].map((_, i) => (
                  <BsStarFill key={i} className="text-yellow-400" size={18} />
                ))}
              </div>
              <p className="text-xl md:text-2xl text-gray-700 leading-relaxed font-medium mb-8">
                "{testimonials[activeTestimonial].text}"
              </p>
              <div className="flex items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center text-white font-bold">
                  {testimonials[activeTestimonial].avatar}
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900">{testimonials[activeTestimonial].name}</div>
                  <div className="text-sm text-gray-500">{testimonials[activeTestimonial].role}</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-10">
            {testimonials.map((_, i) => (
              <button key={i} onClick={() => setActiveTestimonial(i)}
                className={`rounded-full transition-all duration-300 ${i === activeTestimonial ? 'w-7 h-2.5 bg-green-500' : 'w-2.5 h-2.5 bg-gray-300'}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-28">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 p-14 text-white text-center"
        >
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-white/5 -translate-y-1/3 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full bg-white/5 translate-y-1/3 -translate-x-1/3" />

          <div className="relative">
            <HiSparkles size={36} className="mx-auto mb-5 text-green-200" />
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4" style={{ fontFamily: "'Sora', sans-serif" }}>
              Ready to land your dream job?
            </h2>
            <p className="text-green-100 text-lg max-w-lg mx-auto mb-10">
              Join 50,000+ candidates who've transformed their interview performance with AI-powered practice.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/interview')}
              className="bg-white text-green-700 font-bold px-10 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-2 mx-auto"
            >
              Start for Free <BsArrowRight />
            </motion.button>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  )
}

export default Home
