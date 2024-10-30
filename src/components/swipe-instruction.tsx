"use client"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeftCircle, ArrowRightCircle } from "lucide-react"
import { useEffect, useState } from "react"

export function SwipeInstruction() {
  const [show, setShow] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false)
    }, 4000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-50 flex items-center justify-between bg-black/90 px-4 font-bold sm:px-8"
        >
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center gap-1"
          >
            <ArrowLeftCircle className="h-6 w-6 text-white sm:h-8 sm:w-8" />
            <span className="text-xs text-white sm:text-sm">Left</span>
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center"
          >
            <span className="text-xs font-medium text-white sm:text-sm">
              Swipe to view more
            </span>
          </motion.div>

          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center gap-1"
          >
            <ArrowRightCircle className="h-6 w-6 text-white sm:h-8 sm:w-8" />
            <span className="text-xs text-white sm:text-sm">Right</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 