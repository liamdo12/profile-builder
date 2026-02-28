import { Rocket, Mail, Shield, Cpu } from 'lucide-react'

// Individual feature data definition
interface FeatureCard {
  icon: React.ReactNode
  title: string
  description: string
  detail: string
}

const features: FeatureCard[] = [
  {
    icon: <Rocket className="size-6 text-indigo-400" />,
    title: 'Smart Resume Generation',
    description: 'AI-powered resume creation',
    detail:
      'Generate tailored, ATS-optimized resumes instantly. Our AI analyzes job descriptions and crafts content that highlights your most relevant experience.',
  },
  {
    icon: <Mail className="size-6 text-indigo-400" />,
    title: 'Cover Letter Generator',
    description: 'Matching cover letters',
    detail:
      'Create compelling, personalized cover letters that complement your resume and speak directly to each employer\'s needs.',
  },
  {
    icon: <Shield className="size-6 text-indigo-400" />,
    title: 'HR Validation',
    description: 'Professional standards compliance',
    detail:
      'Every resume is validated against industry HR standards to ensure it meets professional expectations and passes screening tools.',
  },
  {
    icon: <Cpu className="size-6 text-indigo-400" />,
    title: 'Multi-LLM Support',
    description: 'Claude, GPT-4, Gemini',
    detail:
      'Choose from multiple leading AI models to generate your documents. Switch between Claude, GPT-4, and Gemini for different results.',
  },
]

// Features section — 4-card grid showcasing key product capabilities
export function LandingFeaturesSection() {
  return (
    <section id="features" className="relative z-20 w-full px-4 py-20">
      <div className="mx-auto max-w-6xl">
        {/* Section heading */}
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Everything You Need
          </h2>
          <p className="text-zinc-400">
            Professional tools powered by cutting-edge AI technology
          </p>
        </div>

        {/* 4-column responsive grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.title} className="flex flex-col rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-colors hover:bg-white/[0.08]">
              <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-indigo-500/10">
                {feature.icon}
              </div>
              <h3 className="mb-1 text-lg font-semibold text-white">{feature.title}</h3>
              <p className="mb-3 text-sm text-zinc-500">{feature.description}</p>
              <p className="text-sm text-zinc-400">{feature.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
