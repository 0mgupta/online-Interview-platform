'use client';

import * as React from 'react';
import { motion, useInView } from 'motion/react';

/**
 * AnimateInView — triggers a motion animation once the element enters the viewport.
 *
 * Props:
 *   variant   — 'fadeUp' | 'fadeDown' | 'fadeLeft' | 'fadeRight' | 'scaleIn' | 'fade'
 *   delay     — delay in seconds before animation starts (default 0)
 *   duration  — animation duration in seconds (default 0.5)
 *   once      — animate only the first time it enters view (default true)
 *   margin    — IntersectionObserver root margin (default '-80px')
 *   className — forwarded className
 *   as        — rendered element type (default 'div')
 */

const VARIANTS = {
  fadeUp: {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0 },
  },
  fadeDown: {
    hidden: { opacity: 0, y: -24 },
    visible: { opacity: 1, y: 0 },
  },
  fadeLeft: {
    hidden: { opacity: 0, x: -28 },
    visible: { opacity: 1, x: 0 },
  },
  fadeRight: {
    hidden: { opacity: 0, x: 28 },
    visible: { opacity: 1, x: 0 },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.94 },
    visible: { opacity: 1, scale: 1 },
  },
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
};

export function AnimateInView({
  children,
  variant = 'fadeUp',
  delay = 0,
  duration = 0.5,
  once = true,
  margin = '-60px',
  className,
  style,
  as = 'div',
}) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once, margin });

  const MotionTag = motion[as] ?? motion.div;

  return (
    <MotionTag
      ref={ref}
      variants={VARIANTS[variant]}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
      style={style}
    >
      {children}
    </MotionTag>
  );
}
