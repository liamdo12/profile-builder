import type { CoverLetterContent } from '@/types/cover-letter'

interface CoverLetterDisplayProps {
  content: CoverLetterContent
}

export function CoverLetterDisplay({ content }: CoverLetterDisplayProps) {
  return (
    <div className="cover-letter-paper bg-white text-black p-8 sm:p-12 shadow-lg rounded-lg" style={{ minHeight: '800px' }}>
      {/* Greeting */}
      <p className="text-base font-semibold mb-6">{content.greeting}</p>

      {/* Body paragraphs */}
      <div className="space-y-4">
        {content.paragraphs.map((paragraph, index) => (
          <p key={index} className="text-sm leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>

      {/* Closing */}
      <p className="text-base mt-8 mb-1">{content.closing}</p>

      {/* Sign-off */}
      <p className="text-base font-semibold">{content.signOff}</p>
    </div>
  )
}
