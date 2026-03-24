import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
import { DataTable } from '@/components/shared/data-table'
import type { Column } from '@/components/shared/data-table'
import { PageHeader } from '@/components/shared/page-header'
import { FileText, Trash2 } from 'lucide-react'
import { fetchDocuments, deleteDocument } from '../api/documentApi'
import { formatEstTimestamp } from '@/lib/format-est-timestamp'
import type { DocumentType, DocumentUploadResponse } from '../types/document'

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`
}

export default function DocumentListPage() {
  const [documents, setDocuments] = useState<DocumentUploadResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState<DocumentType | undefined>(undefined)
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null)

  const loadDocuments = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchDocuments(filter)
      setDocuments(data)
    } catch {
      toast.error('Failed to load documents')
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    loadDocuments()
  }, [loadDocuments])

  const handleDelete = async (id: number) => {
    try {
      await deleteDocument(id)
      setDocuments((prev) => prev.filter((d) => d.id !== id))
      setDeleteTargetId(null)
      toast.success('Document deleted')
    } catch {
      toast.error('Failed to delete document')
    }
  }

  const columns: Column<DocumentUploadResponse>[] = [
    {
      key: 'originalName',
      header: 'Name',
      render: (_, record) => (
        <span className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          {record.originalName as string}
        </span>
      ),
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
      key: 'fileType',
      header: 'Format',
      width: '120px',
      render: (val) => {
        const type = val as string
        const label = type?.includes('pdf') ? 'PDF' : type?.includes('word') ? 'DOC' : type
        return <Badge variant="outline">{label}</Badge>
      },
    },
    {
      key: 'fileSize',
      header: 'Size',
      width: '100px',
      render: (val) => formatBytes(val as number),
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
            setDeleteTargetId(record.id)
          }}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      ),
    },
  ]

  return (
    <>
      <PageHeader title="My Documents" />

      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4">
        <span className="text-sm text-muted-foreground">Filter by type:</span>
        <Select
          value={filter || 'ALL'}
          onValueChange={(val) => setFilter(val === 'ALL' ? undefined : (val as DocumentType))}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Types</SelectItem>
            <SelectItem value="RESUME">Resume</SelectItem>
            <SelectItem value="COVER_LETTER">Cover Letter</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={documents}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        emptyText="No documents uploaded yet"
      />

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
            <AlertDialogAction onClick={() => deleteTargetId && handleDelete(deleteTargetId)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
