'use client';

import * as React from 'react';
import { motion, useMotionValue, useSpring, useAnimationFrame } from 'motion/react';

/**
 * FloatCard — wraps children in a gentle, continuous vertical float animation.
 * Uses a sine-wave animation frame loop for a smooth, organic feel.
 *
 * Props:
 *   amplitude  — pixels of up/down movement (default 8)
 *   speed      — speed multiplier (default 1)
 *   delay      — initial phase offset in seconds (default 0) — use to stagger multiple cards
 *   className  — forwarded className
 *   style      — forwarded style
 */
export function FloatCard({
  children,
  amplitude = 8,
  speed = 0.6,
  delay = 0,
  className,
  style,
}) {
  const y = useMotionValue(0);
  const springY = useSpring(y, { stiffness: 60, damping: 18 });

  useAnimationFrame((t) => {
    const seconds = t / 1000;
    const floatY = Math.sin((seconds + delay) * speed * Math.PI * 2) * amplitude;
    y.set(floatY);
  });

  return (
    <motion.div
      style={{ y: springY, ...style }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
