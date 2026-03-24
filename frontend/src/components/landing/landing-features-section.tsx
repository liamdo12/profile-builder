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
          <h2 className="mb-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything You Need
          </h2>
          <p className="text-gray-600">
            Professional tools powered by cutting-edge AI technology
          </p>
        </div>

        {/* 4-column responsive grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.title} className="flex flex-col rounded-xl border border-gray-200/50 bg-white/80 p-6 backdrop-blur-sm shadow-sm transition-colors hover:bg-white/90 hover:shadow-md">
              <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-indigo-50">
                {feature.icon}
              </div>
              <h3 className="mb-1 text-lg font-semibold text-gray-900">{feature.title}</h3>
              <p className="mb-3 text-sm text-indigo-600">{feature.description}</p>
              <p className="text-sm text-gray-600">{feature.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
