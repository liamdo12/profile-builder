import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/shared/data-table'
import type { Column } from '@/components/shared/data-table'
import { FileUploadDropzone } from '@/components/shared/file-upload-dropzone'
import { PageHeader } from '@/components/shared/page-header'
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
import { fetchDocuments, uploadDocument, deleteDocument } from '../api/documentApi'
import { formatEstTimestamp } from '@/lib/format-est-timestamp'
import { generateSmartResume } from '../api/smart-resume-api'
import type { DocumentUploadResponse } from '../types/document'

// --- Sub-components ---

interface DocTableProps {
  documents: DocumentUploadResponse[]
  selectedDocIds: number[]
  onSelectionChange: (ids: number[]) => void
  onDeleteRequest: (id: number) => void
  onUploadResume: (file: File) => Promise<void>
}

function DocTable({ documents, selectedDocIds, onSelectionChange, onDeleteRequest, onUploadResume }: DocTableProps) {
  const columns: Column<DocumentUploadResponse>[] = [
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
      width: '220px',
      render: (val) => formatEstTimestamp(val as string),
    },
    {
      key: 'id',
      header: '',
      width: '60px',
      render: (_, record) => (
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-destructive"
          onClick={(e) => {
            e.stopPropagation()
            onDeleteRequest(record.id)
          }}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      ),
    },
  ]

  return (
    <>
      <DataTable
        columns={columns}
        data={documents}
        rowKey="id"
        rowSelection={{
          selectedKeys: selectedDocIds,
          onChange: (keys) => onSelectionChange(keys as number[]),
        }}
      />
      <div className="mt-4">
        <p className="text-sm text-muted-foreground mb-2">Don't have a resume uploaded yet?</p>
        <FileUploadDropzone
          accept=".pdf,.doc,.docx"
          files={[]}
          onFilesChange={(f) => f[0] && onUploadResume(f[0])}
          hint="Upload a new resume (PDF, DOC, DOCX)"
        />
      </div>
    </>
  )
}

// --- Main page ---

export default function SmartResumeSetupPage() {
  const navigate = useNavigate()

  const [documents, setDocuments] = useState<DocumentUploadResponse[]>([])
  const [selectedDocIds, setSelectedDocIds] = useState<number[]>([])
  const [jdFile, setJdFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null)

  const files = jdFile ? [jdFile] : []

  useEffect(() => {
    fetchDocuments()
      .then(setDocuments)
      .catch(() => toast.error('Failed to load documents'))
  }, [])

  const handleUploadResume = async (file: File) => {
    try {
      const uploaded = await uploadDocument(file, 'RESUME')
      const refreshed = await fetchDocuments()
      setDocuments(refreshed)
      setSelectedDocIds((prev) => [...prev, uploaded.id])
      toast.success('Resume uploaded')
    } catch {
      toast.error('Failed to upload resume')
    }
  }

  const handleDeleteDocument = async (id: number) => {
    try {
      await deleteDocument(id)
      setDocuments((prev) => prev.filter((d) => d.id !== id))
      setSelectedDocIds((prev) => prev.filter((did) => did !== id))
      setDeleteTargetId(null)
      toast.success('Document deleted')
    } catch {
      toast.error('Failed to delete document')
    }
  }

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
      <DocTable
        documents={documents}
        selectedDocIds={selectedDocIds}
        onSelectionChange={setSelectedDocIds}
        onDeleteRequest={setDeleteTargetId}
        onUploadResume={handleUploadResume}
      />

      <h4 className="text-lg font-medium mt-8 mb-3">2. Upload Job Description</h4>
      <FileUploadDropzone
        accept=".pdf,.png"
        files={files}
        onFilesChange={(f) => setJdFile(f[0] ?? null)}
        hint="Supports PDF or PNG. Max 1 file."
        enablePaste
      />

      <Button
        size="lg"
        className="mt-6"
        disabled={selectedDocIds.length === 0 || !jdFile || loading}
        onClick={handleGenerate}
      >
        {loading ? 'Generating...' : 'Generate Smart Resume'}
      </Button>

      <AlertDialog open={deleteTargetId !== null} onOpenChange={(open) => !open && setDeleteTargetId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Document</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this document? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteTargetId && handleDeleteDocument(deleteTargetId)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
