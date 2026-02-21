import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/shared/data-table'
import type { Column } from '@/components/shared/data-table'
import { FileUploadDropzone } from '@/components/shared/file-upload-dropzone'
import { PageHeader } from '@/components/shared/page-header'
import { fetchDocuments } from '../api/documentApi'
import { generateSmartResume } from '../api/smart-resume-api'
import type { DocumentUploadResponse } from '../types/document'

const docColumns: Column<DocumentUploadResponse>[] = [
  {
    key: 'originalName',
    header: 'File Name',
  },
  {
    key: 'documentType',
    header: 'Type',
    width: '150px',
    render: (val) => (
      <Badge variant={val === 'RESUME' ? 'default' : 'secondary'}>
        {val === 'RESUME' ? 'Resume' : 'Cover Letter'}
      </Badge>
    ),
  },
  {
    key: 'createdAt',
    header: 'Uploaded',
    width: '150px',
    render: (val) => new Date(val as string).toLocaleDateString(),
  },
]

export default function SmartResumeSetupPage() {
  const navigate = useNavigate()

  const [documents, setDocuments] = useState<DocumentUploadResponse[]>([])
  const [selectedDocIds, setSelectedDocIds] = useState<number[]>([])
  const [jdFile, setJdFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  // Derive files array from single jdFile state
  const files = jdFile ? [jdFile] : []

  useEffect(() => {
    fetchDocuments()
      .then(setDocuments)
      .catch(() => toast.error('Failed to load documents'))
  }, [])

  const handleGenerate = async () => {
    if (!jdFile || selectedDocIds.length === 0) return
    setLoading(true)
    try {
      const result = await generateSmartResume(jdFile, selectedDocIds)
      navigate(`/smart-resume/${result.id}`)
    } catch {
      toast.error('Failed to generate smart resume. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-full sm:max-w-3xl">
      <PageHeader title="Smart Resume Generator" />

      <h4 className="text-lg font-medium mb-3">1. Select Source Documents</h4>
      <DataTable
        columns={docColumns}
        data={documents}
        rowKey="id"
        rowSelection={{
          selectedKeys: selectedDocIds,
          onChange: (keys) => setSelectedDocIds(keys as number[]),
        }}
      />

      <h4 className="text-lg font-medium mt-8 mb-3">2. Upload Job Description</h4>
      <FileUploadDropzone
        accept=".pdf,.png"
        files={files}
        onFilesChange={(f) => setJdFile(f[0] ?? null)}
        hint="Supports PDF or PNG. Max 1 file."
      />

      <Button
        size="lg"
        className="mt-6"
        disabled={selectedDocIds.length === 0 || !jdFile || loading}
        onClick={handleGenerate}
      >
        {loading ? 'Generating...' : 'Generate Smart Resume'}
      </Button>
    </div>
  )
}
