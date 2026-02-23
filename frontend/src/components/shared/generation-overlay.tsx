import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'

const DEFAULT_MESSAGES = [
  'Researching the company...',
  'Analyzing your resume and experience...',
  'Reading your master cover letter structure...',
  'Crafting tailored paragraphs...',
  'Aligning with job requirements...',
  'Fine-tuning the cover letter...',
  'Almost there, finalizing your cover letter...',
]

interface GenerationOverlayProps {
  visible: boolean
  messages?: string[]
  title?: string
}

export function GenerationOverlay({
  visible,
  messages = DEFAULT_MESSAGES,
  title = 'Generating...',
}: GenerationOverlayProps) {
  const [messageIndex, setMessageIndex] = useState(0)

  useEffect(() => {
    if (!visible) return
    setMessageIndex(0)
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length)
    }, 4000)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [visible])

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" aria-label="Generation in progress">
      <div className="flex flex-col items-center gap-4 rounded-xl bg-card p-8 shadow-2xl border max-w-sm mx-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground text-center transition-opacity duration-500">
          {messages[messageIndex]}
        </p>
      </div>
    </div>
  )
}
