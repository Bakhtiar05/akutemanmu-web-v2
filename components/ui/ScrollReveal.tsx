'use client'

import { useRef } from 'react'
import {
  motion,
  useInView,
  type Variants,
} from 'framer-motion'

type AnimationVariant = 'fade-up' | 'fade-in' | 'scale' | 'blur-reveal'

interface ScrollRevealProps {
  children: React.ReactNode
  variant?: AnimationVariant
  delay?: number
  duration?: number
  className?: string
  once?: boolean
  amount?: number
  staggerChildren?: number
}

const ease = [0.25, 0.46, 0.45, 0.94] as const

const hidden: Record<AnimationVariant, Record<string, number | string>> = {
  'fade-up': { opacity: 0, y: 32 },
  'fade-in': { opacity: 0 },
  'scale': { opacity: 0, scale: 0.92 },
  'blur-reveal': { opacity: 0, filter: 'blur(10px)', y: 8 },
}

const visible: Record<AnimationVariant, Record<string, number | string>> = {
  'fade-up': { opacity: 1, y: 0 },
  'fade-in': { opacity: 1 },
  'scale': { opacity: 1, scale: 1 },
  'blur-reveal': { opacity: 1, filter: 'blur(0px)', y: 0 },
}

function makeItemVariants(variant: AnimationVariant, duration: number): Variants {
  return {
    hidden: hidden[variant],
    visible: {
      ...visible[variant],
      transition: { duration, ease },
    },
  }
}

export default function ScrollReveal({
  children,
  variant = 'fade-up',
  delay = 0,
  duration = 0.6,
  className,
  once = true,
  amount = 0.2,
  staggerChildren,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, amount })

  // If staggerChildren is set, wrap in a stagger container
  if (staggerChildren) {
    const containerVariants: Variants = {
      hidden: {},
      visible: {
        transition: {
          staggerChildren,
          delayChildren: delay,
        },
      },
    }

    return (
      <motion.div
        ref={ref}
        className={className}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        {children}
      </motion.div>
    )
  }

  const itemVariants = makeItemVariants(variant, duration)

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={itemVariants}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  )
}

/** Child item for use inside a staggered ScrollReveal parent */
export function ScrollRevealItem({
  children,
  variant = 'fade-up',
  duration = 0.6,
  className,
}: {
  children: React.ReactNode
  variant?: AnimationVariant
  duration?: number
  className?: string
}) {
  return (
    <motion.div
      className={className}
      variants={makeItemVariants(variant, duration)}
    >
      {children}
    </motion.div>
  )
}
