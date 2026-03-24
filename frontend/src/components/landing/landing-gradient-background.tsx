// Component: LandingGradientBackground (named export)
// Soft pastel radial gradient background for light aesthetic (indigo/purple tones on white)

export function LandingGradientBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
      style={{
        backgroundColor: '#ffffff',
        backgroundImage: [
          'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(165, 180, 252, 0.4), transparent)',
          'radial-gradient(ellipse 60% 40% at 80% 50%, rgba(196, 181, 253, 0.25), transparent)',
          'radial-gradient(ellipse 50% 50% at 20% 80%, rgba(165, 180, 252, 0.2), transparent)',
        ].join(', '),
      }}
    />
  )
}
