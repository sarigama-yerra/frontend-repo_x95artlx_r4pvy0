import { useEffect, useMemo, useRef, useState } from 'react'
import Spline from '@splinetool/react-spline'
import { motion } from 'framer-motion'
import DataTicker from './DataTicker'
import ScrollIndicator from './ScrollIndicator'
import FluidBackground from './FluidBackground'

export default function Hero() {
  const containerRef = useRef(null)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Map scroll to transforms
  const s = Math.min(1, scrollY / window.innerHeight)
  const swarmScale = 1 - 0.3 * s
  const swarmTranslateY = -150 * s
  const headlineScale = 1 - 0.15 * s
  const headlineOpacity = 1 - 0.7 * s

  const headlineLines = useMemo(() => ['Words', 'into', 'Worlds'], [])

  return (
    <section ref={containerRef} className="relative min-h-screen bg-white overflow-hidden">
      {/* Right 3D structure + fluid bg */}
      <div className="absolute inset-0">
        {/* Gradient mesh background under spline */}
        <div className="absolute right-0 top-0 h-full w-1/2">
          <FluidBackground />
        </div>
        {/* Spline 3D asset on the right half */}
        <motion.div
          style={{ transformOrigin: '50% 50%' }}
          animate={{}}
          className="absolute right-0 top-0 h-full w-1/2"
        >
          <motion.div
            style={{ width: '100%', height: '100%' }}
            animate={{ scale: swarmScale, y: swarmTranslateY }}
            transition={{ type: 'tween', ease: [0.4, 0, 0.2, 1], duration: 0 }}
          >
            <Spline scene="https://prod.spline.design/yji5KWXyD-xKVkWj/scene.splinecode" style={{ width: '100%', height: '100%' }} />
          </motion.div>
        </motion.div>
        {/* Soft white overlay to keep light mood */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-white/60 to-transparent" />
      </div>

      {/* Left content */}
      <div className="relative z-10 flex items-center min-h-screen">
        <div className="px-8 md:px-16 lg:px-24 w-full">
          <div className="max-w-[40vw]">
            <div className="select-none">
              <div className="overflow-hidden leading-[0.95] tracking-[-0.03em] text-[#050505]" style={{ fontFamily: 'Playfair Display, serif' }}>
                {headlineLines.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, filter: 'blur(8px)', y: 8 }}
                    animate={{ opacity: headlineOpacity, filter: `blur(${(1-headlineOpacity)*8}px)`, y: 0, scale: headlineScale }}
                    transition={{ delay: i * 0.8, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                    className="text-[56pt] md:text-[64pt] lg:text-[72pt] font-black"
                  >
                    {line}
                  </motion.div>
                ))}
              </div>

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 0.9, y: 0 }}
                transition={{ delay: headlineLines.length * 0.8 + 1.2, duration: 0.8 }}
                className="mt-6 text-[16pt] text-[#333333]" style={{ fontFamily: 'Space Mono, ui-monospace, SFMono-Regular, Menlo, monospace' }}
              >
                Brands, Strategy, Design and Technology.
              </motion.p>

              <DataTicker />

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: headlineLines.length * 0.8 + 2.2, duration: 0.6 }}
                className="mt-16 inline-flex items-center gap-3 border border-black px-9 py-4 text-[16pt] font-medium tracking-tight text-black hover:text-white relative"
              >
                <span className="relative z-10" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>Start the Engineering →</span>
                <span className="absolute inset-0 bg-black scale-x-0 origin-left transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-x-100" />
                {/* Electric blue glow on hover using after element */}
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <ScrollIndicator />
    </section>
  )
}
