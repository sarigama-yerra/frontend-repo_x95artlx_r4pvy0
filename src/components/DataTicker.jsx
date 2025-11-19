import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const messagesSeed = [
  'Semantic Field: Active',
  'Prompt Engineering: Optimized',
  'Strategy: Initializing…',
]

function glitchify(text) {
  // Subtle glitch: randomly replace 1-2 characters with similar glyphs briefly
  const glyphs = ['∷', '·', '∙', '∙', '⌁', '⎓', '≀', '⋮']
  if (Math.random() < 0.7) return text
  const arr = text.split('')
  const changes = Math.random() < 0.5 ? 1 : 2
  for (let i = 0; i < changes; i++) {
    const idx = Math.floor(Math.random() * arr.length)
    arr[idx] = glyphs[Math.floor(Math.random() * glyphs.length)]
  }
  return arr.join('')
}

export default function DataTicker() {
  const baseMessages = useMemo(() => messagesSeed, [])
  const [index, setIndex] = useState(0)
  const [display, setDisplay] = useState(baseMessages[0])

  useEffect(() => {
    const rotate = setInterval(() => {
      setIndex((i) => (i + 1) % baseMessages.length)
    }, 2500)
    return () => clearInterval(rotate)
  }, [baseMessages.length])

  useEffect(() => {
    // Apply glitch briefly during transition
    const t1 = setTimeout(() => setDisplay(glitchify(baseMessages[index])), 120)
    const t2 = setTimeout(() => setDisplay(baseMessages[index]), 420)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [index, baseMessages])

  return (
    <div className="mt-10 select-none" aria-live="polite">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 6, filter: 'blur(2px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -6, filter: 'blur(2px)' }}
          transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
          className="font-[Space_Mono] text-[14pt] text-[#0047FF] tracking-tight"
        >
          {display}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
