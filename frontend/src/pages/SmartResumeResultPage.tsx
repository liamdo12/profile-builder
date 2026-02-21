import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { ResumeDownloadButton } from '@/components/shared/resume-download-button'
import { SmartResumePaper } from '@/components/resume/smart-resume-paper'
import { HrValidationPanel } from '@/components/resume/hr-validation-panel'
import { getSmartResume, regenerateSmartResume } from '../api/smart-resume-api'
import type { SmartGeneratedResumeResponse } from '../types/smart-resume'

export default function SmartResumeResultPage() {
  const { smartResumeId } = useParams<{ smartResumeId: string }>()
  const [resume, setResume] = useState<SmartGeneratedResumeResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [regenerating, setRegenerating] = useState(false)

  useEffect(() => {
    getSmartResume(Number(smartResumeId))
      .then(setResume)
      .catch(() => toast.error('Failed to load resume'))
      .finally(() => setLoading(false))
  }, [smartResumeId])

  const handleRegenerate = async () => {
    setRegenerating(true)
    try {
      const updated = await regenerateSmartResume(Number(smartResumeId))
      setResume(updated)
    } catch {
      toast.error('Failed to regenerate resume')
    } finally {
      setRegenerating(false)
    }
  }

  if (loading) return <LoadingSpinner label="Loading resume..." />
  if (!resume) return null

  return (
    <div className="mx-auto max-w-full sm:max-w-4xl">
      <SmartResumePaper resumeContent={resume.resumeContent} />

      {resume.validation && <HrValidationPanel validation={resume.validation} />}

      <div className="mt-6 flex items-center justify-center gap-4">
        <ResumeDownloadButton
          targetSelector=".smart-resume-paper"
          fileName={`${resume.resumeContent.personalInfo?.fullName ?? 'resume'}.pdf`}
        />
        <Button variant="outline" size="lg" disabled={regenerating} onClick={handleRegenerate}>
          {regenerating ? 'Regenerating...' : 'Re-generate Resume'}
        </Button>
      </div>
    </div>
  )
}
