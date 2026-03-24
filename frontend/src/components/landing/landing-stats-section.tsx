import { Cpu, Target, FileText, ShieldCheck } from 'lucide-react'

// Stat item data definition
interface StatItem {
  icon: React.ReactNode
  value: string
  label: string
}

const stats: StatItem[] = [
  {
    icon: <Cpu className="size-6 text-indigo-400" />,
    value: '3',
    label: 'AI Models',
  },
  {
    icon: <Target className="size-6 text-indigo-400" />,
    value: '100%',
    label: 'ATS-Optimized',
  },
  {
    icon: <FileText className="size-6 text-indigo-400" />,
    value: 'Smart',
    label: 'Cover Letters',
  },
  {
    icon: <ShieldCheck className="size-6 text-indigo-400" />,
    value: 'HR',
    label: 'Validated',
  },
]

// Stats section — key platform highlights with glass icon circles
export function LandingStatsSection() {
  return (
    <section className="relative z-20 w-full border-t border-b border-gray-200/50 px-4 py-16">
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center gap-2 text-center"
            >
              <div className="flex size-12 items-center justify-center rounded-full border border-indigo-200 bg-indigo-50">
                {stat.icon}
              </div>
              <span className="text-3xl font-bold text-gray-900">{stat.value}</span>
              <span className="text-sm text-gray-600">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
