import { motion } from "motion/react"
import { type ReactNode, useRef } from "react"

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
 * Only animates on initial mount, not on subsequent re-renders.
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
  const hasAnimated = useRef(false)

  // Only animate on first mount
  const shouldAnimate = !hasAnimated.current
  if (shouldAnimate) {
    hasAnimated.current = true
  }

  return (
    <motion.div
      initial={shouldAnimate ? { opacity: 0, x: offset.x, y: offset.y } : false}
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
