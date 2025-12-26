import { motion } from "motion/react"
import type { ReactNode } from "react"

interface StaggerSlideInProps {
  children: ReactNode
  index?: number
  delay?: number
  direction?: "left" | "right" | "up" | "down"
  className?: string
}

const directionOffset = {
  left: { x: -20, y: 0 },
  right: { x: 20, y: 0 },
  up: { x: 0, y: 20 },
  down: { x: 0, y: -20 },
}

/**
 * Wrapper component for staggered slide-in animations (wave effect).
 *
 * @param index - Position in sequence (0, 1, 2...) for stagger effect
 * @param delay - Base delay between items in seconds (default: 0.05)
 * @param direction - Slide direction: "left" | "right" | "up" | "down" (default: "right")
 */
export function StaggerSlideIn({
  children,
  index = 0,
  delay = 0.05,
  direction = "right",
  className,
}: StaggerSlideInProps) {
  const offset = directionOffset[direction]

  return (
    <motion.div
      initial={{ opacity: 0, x: offset.x, y: offset.y }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{
        duration: 0.2,
        delay: index * delay,
        ease: "easeOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
