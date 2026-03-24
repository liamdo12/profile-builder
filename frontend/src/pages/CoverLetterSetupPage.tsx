import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { FileUploadDropzone } from '@/components/shared/file-upload-dropzone'
import { PageHeader } from '@/components/shared/page-header'
import { GenerationOverlay } from '@/components/shared/generation-overlay'
import { DocumentSection } from '@/components/cover-letter/document-section'
import { fetchDocuments, uploadDocument, deleteDocument } from '../api/documentApi'
import { generateCoverLetter } from '../api/cover-letter-api'
import type { DocumentUploadResponse } from '../types/document'

export default function CoverLetterSetupPage() {
  const navigate = useNavigate()

  const [resumes, setResumes] = useState<DocumentUploadResponse[]>([])
  const [coverLetters, setCoverLetters] = useState<DocumentUploadResponse[]>([])
  const [selectedResumeId, setSelectedResumeId] = useState<number | null>(null)
  const [selectedCoverLetterId, setSelectedCoverLetterId] = useState<number | null>(null)
  const [jdFile, setJdFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null)

  const jdFiles = jdFile ? [jdFile] : []

  const loadResumes = () =>
    fetchDocuments('RESUME')
      .then(setResumes)
      .catch(() => toast.error('Failed to load resumes'))

  const loadCoverLetters = () =>
    fetchDocuments('COVER_LETTER')
      .then(setCoverLetters)
      .catch(() => toast.error('Failed to load cover letters'))

  useEffect(() => {
    loadResumes()
    loadCoverLetters()
  }, [])

  const handleUploadResume = async (file: File) => {
    try {
      const uploaded = await uploadDocument(file, 'RESUME')
      await loadResumes()
      setSelectedResumeId(uploaded.id)
      toast.success('Resume uploaded')
    } catch {
      toast.error('Failed to upload resume')
    }
  }

  const handleUploadCoverLetter = async (file: File) => {
    try {
      const uploaded = await uploadDocument(file, 'COVER_LETTER')
      await loadCoverLetters()
      setSelectedCoverLetterId(uploaded.id)
      toast.success('Cover letter uploaded')
    } catch {
      toast.error('Failed to upload cover letter')
    }
  }

  const handleDeleteResume = async (id: number) => {
    try {
      await deleteDocument(id)
      setResumes((prev) => prev.filter((d) => d.id !== id))
      if (selectedResumeId === id) setSelectedResumeId(null)
      setDeleteTargetId(null)
      toast.success('Resume deleted')
    } catch {
      toast.error('Failed to delete resume')
    }
  }

  const handleDeleteCoverLetter = async (id: number) => {
    try {
      await deleteDocument(id)
      setCoverLetters((prev) => prev.filter((d) => d.id !== id))
      if (selectedCoverLetterId === id) setSelectedCoverLetterId(null)
      setDeleteTargetId(null)
      toast.success('Cover letter deleted')
    } catch {
      toast.error('Failed to delete cover letter')
    }
  }

  const handleConfirmDelete = () => {
    if (!deleteTargetId) return
    const isResume = resumes.some((r) => r.id === deleteTargetId)
    if (isResume) handleDeleteResume(deleteTargetId)
    else handleDeleteCoverLetter(deleteTargetId)
  }

  const handleGenerate = async () => {
    if (!jdFile || !selectedResumeId || !selectedCoverLetterId) return
    setLoading(true)
    try {
      const result = await generateCoverLetter(jdFile, selectedResumeId, selectedCoverLetterId)
      navigate(`/cover-letter/${result.id}`)
    } catch {
      toast.error('Failed to generate cover letter. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const canGenerate = !!jdFile && !!selectedResumeId && !!selectedCoverLetterId

  return (
    <>
      <GenerationOverlay visible={loading} />

      <div className="mx-auto max-w-full sm:max-w-3xl">
        <PageHeader title="Cover Letter Generator" />

        {/* Step 1: Job Description */}
        <div className="rounded-lg border p-4">
          <h4 className="text-lg font-medium mb-3">1. Upload Job Description</h4>
          <FileUploadDropzone
            accept=".pdf,.png"
            files={jdFiles}
            onFilesChange={(f) => setJdFile(f[0] ?? null)}
            hint="Supports PDF or PNG. Max 1 file."
            enablePaste
          />
        </div>

        {/* Step 2: Resume */}
        <DocumentSection
          stepNumber={2}
          title="Select Resume"
          documents={resumes}
          selectedId={selectedResumeId}
          onSelect={setSelectedResumeId}
          onUpload={handleUploadResume}
          onDeleteRequest={setDeleteTargetId}
          uploadHint="Upload a new resume (PDF)"
          emptyText="No resumes found"
          className="mt-6"
        />

        {/* Step 3: Cover Letter Template */}
        <DocumentSection
          stepNumber={3}
          title="Select Cover Letter Template"
          documents={coverLetters}
          selectedId={selectedCoverLetterId}
          onSelect={setSelectedCoverLetterId}
          onUpload={handleUploadCoverLetter}
          onDeleteRequest={setDeleteTargetId}
          uploadHint="Upload a new cover letter template (PDF)"
          emptyText="No cover letters found"
          className="mt-6"
        />

        <Button
          size="lg"
          className="mt-6"
          disabled={!canGenerate || loading}
          onClick={handleGenerate}
        >
          {loading ? 'Generating...' : 'Generate Cover Letter'}
        </Button>
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog
        open={deleteTargetId !== null}
        onOpenChange={(open) => !open && setDeleteTargetId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Document</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this document? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
