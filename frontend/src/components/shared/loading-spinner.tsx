import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  label?: string
  className?: string
}

export function LoadingSpinner({ label, className }: LoadingSpinnerProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-20', className)}>
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      {label && <p className="mt-3 text-sm text-muted-foreground">{label}</p>}
    </div>
  )
}
