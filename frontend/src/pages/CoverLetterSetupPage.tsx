import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/shared/data-table'
import type { Column } from '@/components/shared/data-table'
import { FileUploadDropzone } from '@/components/shared/file-upload-dropzone'
import { PageHeader } from '@/components/shared/page-header'
import { GenerationOverlay } from '@/components/shared/generation-overlay'
import { fetchDocuments, uploadDocument } from '../api/documentApi'
import { generateCoverLetter } from '../api/cover-letter-api'
import type { DocumentUploadResponse } from '../types/document'

const docColumns: Column<DocumentUploadResponse>[] = [
  { key: 'originalName', header: 'File Name' },
  {
    key: 'createdAt',
    header: 'Uploaded',
    width: '150px',
    render: (val) => new Date(val as string).toLocaleDateString(),
  },
]

export default function CoverLetterSetupPage() {
  const navigate = useNavigate()

  const [resumes, setResumes] = useState<DocumentUploadResponse[]>([])
  const [coverLetters, setCoverLetters] = useState<DocumentUploadResponse[]>([])
  const [selectedResumeId, setSelectedResumeId] = useState<number | null>(null)
  const [selectedCoverLetterId, setSelectedCoverLetterId] = useState<number | null>(null)
  const [jdFile, setJdFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

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

        <h4 className="text-lg font-medium mb-3">1. Upload Job Description</h4>
        <FileUploadDropzone
          accept=".pdf,.png"
          files={jdFiles}
          onFilesChange={(f) => setJdFile(f[0] ?? null)}
          hint="Supports PDF or PNG. Max 1 file."
        />

        <h4 className="text-lg font-medium mt-8 mb-3">2. Select Resume</h4>
        <DataTable
          columns={docColumns}
          data={resumes}
          rowKey="id"
          emptyText="No resumes found"
          rowSelection={{
            selectedKeys: selectedResumeId !== null ? [selectedResumeId] : [],
            onChange: (keys) =>
              setSelectedResumeId(keys.length > 0 ? (keys[keys.length - 1] as number) : null),
          }}
        />
        <div className="mt-3">
          <FileUploadDropzone
            accept=".pdf"
            files={[]}
            onFilesChange={(f) => f[0] && handleUploadResume(f[0])}
            hint="Upload a new resume (PDF)"
          />
        </div>

        <h4 className="text-lg font-medium mt-8 mb-3">3. Select Cover Letter Template</h4>
        <DataTable
          columns={docColumns}
          data={coverLetters}
          rowKey="id"
          emptyText="No cover letters found"
          rowSelection={{
            selectedKeys: selectedCoverLetterId !== null ? [selectedCoverLetterId] : [],
            onChange: (keys) =>
              setSelectedCoverLetterId(keys.length > 0 ? (keys[keys.length - 1] as number) : null),
          }}
        />
        <div className="mt-3">
          <FileUploadDropzone
            accept=".pdf"
            files={[]}
            onFilesChange={(f) => f[0] && handleUploadCoverLetter(f[0])}
            hint="Upload a new cover letter template (PDF)"
          />
        </div>

        <Button
          size="lg"
          className="mt-6"
          disabled={!canGenerate || loading}
          onClick={handleGenerate}
        >
          {loading ? 'Generating...' : 'Generate Cover Letter'}
        </Button>
      </div>
    </>
  )
}
