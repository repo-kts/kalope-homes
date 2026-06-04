import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ── Launch target the countdown ticks toward ───────────────────────────
const LAUNCH_DATE = new Date('2026-09-01T09:00:00')

// Curated interior photography (Unsplash). Each room is a different mood.
const SCENES = [
  {
    src: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=2100&q=80',
    label: 'The Living Room',
    place: 'Warm minimalism',
  },
  {
    src: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=2100&q=80',
    label: 'The Bedroom',
    place: 'Quiet luxury',
  },
  {
    src: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2100&q=80',
    label: 'The Lounge',
    place: 'Textured calm',
  },
  {
    src: 'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?auto=format&fit=crop&w=2100&q=80',
    label: 'The Kitchen',
    place: 'Crafted detail',
  },
]

function useCountdown(target) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  const diff = Math.max(0, target - now)
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  }
}

const pad = (n) => String(n).padStart(2, '0')

function CountUnit({ value, label }) {
  return (
    <div className="count-unit">
      <div className="count-value">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={value}
            initial={{ y: '70%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '-70%', opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {pad(value)}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="count-label">{label}</span>
    </div>
  )
}

export default function App() {
  const { days, hours, minutes, seconds } = useCountdown(LAUNCH_DATE)
  const [active, setActive] = useState(0)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')
  const year = useMemo(() => new Date().getFullYear(), [])

  // Preload images so the crossfade is seamless
  useEffect(() => {
    SCENES.forEach((s) => {
      const img = new Image()
      img.src = s.src
    })
  }, [])

  // Auto-advance the slideshow
  useEffect(() => {
    const id = setInterval(() => {
      setActive((i) => (i + 1) % SCENES.length)
    }, 5500)
    return () => clearInterval(id)
  }, [])

  function handleSubmit(e) {
    e.preventDefault()
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return
    setStatus('done')
  }

  const scene = SCENES[active]

  return (
    <main className="stage">
      {/* ── Full-bleed photography backdrop ── */}
      <div className="backdrop">
        <AnimatePresence>
          <motion.div
            key={active}
            className="backdrop__img"
            style={{ backgroundImage: `url(${scene.src})` }}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 1.6, ease: 'easeInOut' }, scale: { duration: 7, ease: 'linear' } }}
          />
        </AnimatePresence>
        <div className="backdrop__veil" />
        <div className="grain" aria-hidden="true" />
      </div>

      {/* ── Top bar ── */}
      <motion.header
        className="topbar"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      >
        <img className="brand-logo" src="/logo-full.png" alt="KalopeHomes — Interior Design Studio" />
        <span className="topbar__tag">Interior Design Studio</span>
      </motion.header>

      {/* ── Center content ── */}
      <section className="content">
        <motion.p
          className="eyebrow"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5 }}
        >
          <span className="eyebrow__line" /> Coming Soon — Est. {year}
        </motion.p>

        <motion.h1
          className="headline"
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.65 }}
        >
          Interiors that feel
          <span className="headline__em">effortlessly yours.</span>
        </motion.h1>

        <motion.p
          className="lede"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.85 }}
        >
          A design studio composing calm, characterful homes — texture, light and
          proportion in balance. Our portfolio unveils soon.
        </motion.p>

        <motion.div
          className="countdown"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <CountUnit value={days} label="Days" />
          <span className="count-sep" />
          <CountUnit value={hours} label="Hrs" />
          <span className="count-sep" />
          <CountUnit value={minutes} label="Min" />
          <span className="count-sep" />
          <CountUnit value={seconds} label="Sec" />
        </motion.div>

        <motion.div
          className="signup"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.15 }}
        >
          <AnimatePresence mode="wait">
            {status === 'idle' ? (
              <motion.form
                key="form"
                className="signup__form"
                onSubmit={handleSubmit}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
              >
                <input
                  type="email"
                  className="signup__input"
                  placeholder="Enter your email for the first look"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-label="Email address"
                  required
                />
                <button type="submit" className="signup__btn">
                  Notify me <span className="signup__arrow">→</span>
                </button>
              </motion.form>
            ) : (
              <motion.p
                key="thanks"
                className="signup__thanks"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                ✦ You're on the list — an invitation to the unveiling awaits.
              </motion.p>
            )}
          </AnimatePresence>

          <p className="contact">
            <span className="contact__label">Enquiries</span>
            <a className="contact__link" href="tel:+918271293308">
              +91 82712 93308
            </a>
          </p>
        </motion.div>
      </section>

      {/* ── Scene caption + gallery dots ── */}
      <motion.footer
        className="footer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 1.3 }}
      >
        <div className="caption">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.5 }}
            >
              <span className="caption__num">0{active + 1} / 0{SCENES.length}</span>
              <span className="caption__label">{scene.label}</span>
              <span className="caption__place">{scene.place}</span>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="dots">
          {SCENES.map((s, i) => (
            <button
              key={s.label}
              className={`dot ${i === active ? 'dot--on' : ''}`}
              onClick={() => setActive(i)}
              aria-label={`View ${s.label}`}
            >
              <span className="dot__fill" />
            </button>
          ))}
        </div>
      </motion.footer>
    </main>
  )
}
