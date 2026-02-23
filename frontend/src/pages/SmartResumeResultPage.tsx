import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { ResumeDownloadButton } from '@/components/shared/resume-download-button'
import { SmartResumePaper } from '@/components/resume/smart-resume-paper'
import { HrValidationPanel } from '@/components/resume/hr-validation-panel'
import { getSmartResume, regenerateSmartResume, downloadSmartResumeDocx, applyRecommendations } from '../api/smart-resume-api'
import type { SmartGeneratedResumeResponse, RecommendationItem } from '../types/smart-resume'

export default function SmartResumeResultPage() {
  const { smartResumeId } = useParams<{ smartResumeId: string }>()
  const [resume, setResume] = useState<SmartGeneratedResumeResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [regenerating, setRegenerating] = useState(false)
  const [applyingRecs, setApplyingRecs] = useState(false)
  const [downloadingDocx, setDownloadingDocx] = useState(false)

  const busy = regenerating || applyingRecs || downloadingDocx

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

  const handleDownloadDocx = async () => {
    setDownloadingDocx(true)
    try {
      const blob = await downloadSmartResumeDocx(Number(smartResumeId))
      const fullName = resume?.resumeContent.personalInfo?.fullName ?? 'resume'
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${fullName}.docx`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch {
      toast.error('Failed to download Word document')
    } finally {
      setDownloadingDocx(false)
    }
  }

  const handleApplyRecommendations = async (recommendations: RecommendationItem[]) => {
    setApplyingRecs(true)
    try {
      const updated = await applyRecommendations(Number(smartResumeId), recommendations)
      setResume(updated)
      toast.success('Recommendations applied successfully')
    } catch {
      toast.error('Failed to apply recommendations')
    } finally {
      setApplyingRecs(false)
    }
  }

  if (loading) return <LoadingSpinner label="Loading resume..." />
  if (!resume) return null

  return (
    // Two-column CSS Grid: left = resume (sticky), right = validation panel (scrollable)
    <div className="w-full px-4 grid grid-cols-1 lg:grid-cols-[minmax(0,55%)_minmax(0,45%)] gap-6 lg:gap-8 items-start">
      {/* Left column: resume paper + action buttons */}
      <div className="lg:sticky lg:top-4 max-w-[860px] mx-auto">
        <SmartResumePaper resumeContent={resume.resumeContent} />

        <div className="mt-6 flex items-center justify-center gap-4">
          <ResumeDownloadButton
            targetSelector=".smart-resume-paper"
            fileName={`${resume.resumeContent.personalInfo?.fullName ?? 'resume'}.pdf`}
          />
          <Button variant="outline" size="lg" disabled={busy} onClick={handleDownloadDocx}>
            <FileText className="h-4 w-4 mr-2" />
            {downloadingDocx ? 'Downloading...' : 'Download Word'}
          </Button>
          <Button variant="outline" size="lg" disabled={busy} onClick={handleRegenerate}>
            {regenerating ? 'Regenerating...' : 'Re-generate Resume'}
          </Button>
        </div>
      </div>

      {/* Right column: HR validation panel */}
      {resume.validation && (
        <div>
          <HrValidationPanel
            validation={resume.validation}
            onApplySelected={handleApplyRecommendations}
            applyingRecommendations={applyingRecs}
          />
        </div>
      )}
    </div>
  )
}
