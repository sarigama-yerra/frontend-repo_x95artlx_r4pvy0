import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ScrollIndicator() {
  const [show, setShow] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setShow(false), 3000)
    const onScroll = () => setShow(false)
    window.addEventListener('scroll', onScroll)
    return () => { clearTimeout(t); window.removeEventListener('scroll', onScroll) }
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="pointer-events-none fixed left-1/2 -translate-x-1/2 bottom-10 flex flex-col items-center text-black"
        >
          <div className="text-xs tracking-widest mb-2">01 / PHILOSOPHY</div>
          <div className="relative h-16 w-px bg-black/80 overflow-visible">
            <motion.span
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-black"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ repeat: Infinity, duration: 1.6 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
