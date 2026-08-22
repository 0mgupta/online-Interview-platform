'use client';

import * as React from 'react';
import { motion, useInView } from 'motion/react';

/**
 * StaggerChildren — animates each direct child in sequence when the container
 * enters the viewport.
 *
 * Props:
 *   staggerDelay   — delay between each child animation (default 0.08s)
 *   initialDelay   — delay before the first child starts (default 0)
 *   childVariant   — motion variant for each child (default: fadeUp)
 *   duration       — each child's animation duration (default 0.45s)
 *   once           — animate only on first scroll-in (default true)
 *   margin         — IntersectionObserver margin (default '-60px')
 *   className      — container className
 *   style          — container style
 */

const DEFAULT_CONTAINER_VARIANTS = (staggerDelay, initialDelay) => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: staggerDelay,
      delayChildren: initialDelay,
    },
  },
});

const DEFAULT_CHILD_VARIANTS = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { ease: [0.25, 0.1, 0.25, 1] },
  },
};

export function StaggerChildren({
  children,
  staggerDelay = 0.08,
  initialDelay = 0,
  duration = 0.45,
  once = true,
  margin = '-60px',
  className,
  style,
}) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once, margin });

  const containerVariants = DEFAULT_CONTAINER_VARIANTS(staggerDelay, initialDelay);
  const childVariants = {
    hidden: DEFAULT_CHILD_VARIANTS.hidden,
    visible: {
      ...DEFAULT_CHILD_VARIANTS.visible,
      transition: {
        ...DEFAULT_CHILD_VARIANTS.visible.transition,
        duration,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className={className}
      style={style}
    >
      {React.Children.map(children, (child, i) => {
        if (!React.isValidElement(child)) return child;
        return (
          <motion.div key={i} variants={childVariants}>
            {child}
          </motion.div>
        );
      })}
    </motion.div>
  );
}
