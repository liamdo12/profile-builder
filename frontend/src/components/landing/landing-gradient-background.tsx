// Component: LandingGradientBackground (named export)
// Atmospheric radial gradient background with colored glow spots for Luma-style dark aesthetic

export function LandingGradientBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
      style={{
        backgroundColor: '#09090b',
        backgroundImage: [
          'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(120, 119, 198, 0.3), transparent)',
          'radial-gradient(ellipse 60% 40% at 80% 50%, rgba(59, 130, 246, 0.15), transparent)',
          'radial-gradient(ellipse 50% 50% at 20% 80%, rgba(139, 92, 246, 0.2), transparent)',
        ].join(', '),
      }}
    />
  )
}
