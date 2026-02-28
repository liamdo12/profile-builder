// Component: LandingNoiseOverlay (named export)
// Full-viewport SVG noise/grain texture overlay for premium dark aesthetic

import { useId } from 'react'

export function LandingNoiseOverlay() {
  const filterId = useId()

  return (
    <svg
      className="pointer-events-none fixed inset-0 z-10 h-full w-full opacity-[0.03]"
      aria-hidden="true"
    >
      <filter id={filterId}>
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.65"
          numOctaves="3"
          stitchTiles="stitch"
        />
      </filter>
      <rect width="100%" height="100%" filter={`url(#${filterId})`} />
    </svg>
  )
}
