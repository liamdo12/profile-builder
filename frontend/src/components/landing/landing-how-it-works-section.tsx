import { Upload, Sparkles, Download } from 'lucide-react'

// Step data definition for how-it-works flow
interface Step {
  number: number
  icon: React.ReactNode
  title: string
  description: string
}

const steps: Step[] = [
  {
    number: 1,
    icon: <Upload className="size-8 text-indigo-400" />,
    title: 'Upload Your Resume',
    description:
      'Upload your existing resume or start from scratch. Our system accepts PDF and Word documents and extracts your information automatically.',
  },
  {
    number: 2,
    icon: <Sparkles className="size-8 text-indigo-400" />,
    title: 'AI Generates',
    description:
      'Select your preferred AI model — Claude, GPT-4, or Gemini — and let it craft a polished, ATS-optimized resume tailored to your target role.',
  },
  {
    number: 3,
    icon: <Download className="size-8 text-indigo-400" />,
    title: 'Download & Apply',
    description:
      'Download your professional resume and cover letter in PDF format, ready to submit to employers and job boards.',
  },
]

// How-it-works section — 3-step process overview with numbered badges
export function LandingHowItWorksSection() {
  return (
    <section className="relative z-20 w-full border-t border-b border-white/5 px-4 py-20">
      <div className="mx-auto max-w-5xl">
        {/* Section heading */}
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            How It Works
          </h2>
          <p className="text-zinc-400">
            Three simple steps to your perfect resume
          </p>
        </div>

        {/* 3-column steps grid */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="flex flex-col items-center text-center">
              {/* Number badge */}
              <div className="mb-4 flex size-10 items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-sm font-bold text-white shadow-lg shadow-indigo-500/25">
                {step.number}
              </div>

              {/* Icon */}
              <div className="mb-4 text-indigo-400">{step.icon}</div>

              {/* Title */}
              <h3 className="mb-2 text-lg font-semibold text-white">{step.title}</h3>

              {/* Description */}
              <p className="text-sm text-zinc-400">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
