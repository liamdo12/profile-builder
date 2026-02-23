import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
import { DataTable } from '@/components/shared/data-table'
import type { Column } from '@/components/shared/data-table'
import { PageHeader } from '@/components/shared/page-header'
import { FileText, Upload } from 'lucide-react'
import { fetchDocuments } from '../api/documentApi'
import type { DocumentType, DocumentUploadResponse } from '../types/document'

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`
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
    width: '180px',
    render: (val) =>
      new Date(val as string).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
  },
]

export default function DocumentListPage() {
  const navigate = useNavigate()
  const [documents, setDocuments] = useState<DocumentUploadResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState<DocumentType | undefined>(undefined)

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

  return (
    <>
      <PageHeader title="My Documents">
        <Button onClick={() => navigate('/upload')}>
          <Upload className="h-4 w-4 mr-2" /> Upload
        </Button>
      </PageHeader>

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
    </>
  )
}
