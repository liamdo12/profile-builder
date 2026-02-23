import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { ResumeDownloadButton } from '@/components/shared/resume-download-button'
import { CoverLetterDisplay } from '@/components/cover-letter/cover-letter-display'
import { CoverLetterEvaluationPanel } from '@/components/cover-letter/cover-letter-evaluation-panel'
import { getCoverLetter, evaluateCoverLetter } from '../api/cover-letter-api'
import type { CoverLetterResponse } from '../types/cover-letter'

export default function CoverLetterResultPage() {
  const { coverLetterId } = useParams<{ coverLetterId: string }>()
  const [result, setResult] = useState<CoverLetterResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [evaluating, setEvaluating] = useState(false)

  useEffect(() => {
    getCoverLetter(Number(coverLetterId))
      .then(setResult)
      .catch(() => toast.error('Failed to load cover letter'))
      .finally(() => setLoading(false))
  }, [coverLetterId])

  const handleEvaluate = async () => {
    if (!result) return
    setEvaluating(true)
    try {
      const updated = await evaluateCoverLetter(result.id)
      setResult(updated)
    } catch {
      toast.error('Failed to evaluate cover letter')
    } finally {
      setEvaluating(false)
    }
  }

  if (loading) return <LoadingSpinner label="Loading cover letter..." />
  if (!result) return null

  return (
    <div className="w-full px-4 grid grid-cols-1 lg:grid-cols-[minmax(0,55%)_minmax(0,45%)] gap-6 lg:gap-8 items-start">
      {/* Left: cover letter display (sticky) */}
      <div className="lg:sticky lg:top-4 max-w-[860px] mx-auto">
        <CoverLetterDisplay content={result.coverLetterContent} />
        <div className="mt-6 flex items-center justify-center gap-4">
          <ResumeDownloadButton
            targetSelector=".cover-letter-paper"
            fileName="cover-letter.pdf"
          />
        </div>
      </div>

      {/* Right: evaluation panel (on-demand) */}
      <div>
        {!result.evaluation && !evaluating && (
          <Button onClick={handleEvaluate} size="lg" className="w-full">
            Evaluate Cover Letter
          </Button>
        )}
        {evaluating && <LoadingSpinner label="Evaluating..." />}
        {result.evaluation && (
          <CoverLetterEvaluationPanel evaluation={result.evaluation} />
        )}
      </div>
    </div>
  )
}
