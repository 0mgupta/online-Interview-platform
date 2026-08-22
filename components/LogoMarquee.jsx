'use client';

import Image from "next/image";

/**
 * LogoMarquee — infinite horizontal scroll of logos.
 * Renders two copies of the logo list side-by-side and animates them
 * using the CSS `marquee` keyframe defined in globals.css.
 * Pauses on hover.
 */
export default function LogoMarquee({ logos = [] }) {
  return (
    <div className="overflow-hidden w-full" aria-label="Partner logos">
      <div className="v-marquee-track">
        {/* First copy */}
        {logos.map((l, i) => (
          <Image
            key={`a-${i}`}
            src={l.src}
            alt={l.alt}
            width={50}
            height={50}
            className="h-6 w-auto shrink-0"
            style={{ filter: "grayscale(100%) contrast(0.6)" }}
          />
        ))}
        {/* Duplicate for seamless loop */}
        {logos.map((l, i) => (
          <Image
            key={`b-${i}`}
            src={l.src}
            alt={l.alt}
            width={50}
            height={50}
            className="h-6 w-auto shrink-0"
            style={{ filter: "grayscale(100%) contrast(0.6)" }}
            aria-hidden
          />
        ))}
      </div>
    </div>
  );
}
