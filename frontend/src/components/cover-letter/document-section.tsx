// Reusable section component for selecting and uploading documents (resume / cover letter template).
// Renders a bordered step card with a DataTable for selection and a FileUploadDropzone for upload.
import { Trash2 } from 'lucide-react'
import { formatEstTimestamp } from '@/lib/format-est-timestamp'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/shared/data-table'
import type { Column } from '@/components/shared/data-table'
import { FileUploadDropzone } from '@/components/shared/file-upload-dropzone'
import type { DocumentUploadResponse } from '@/types/document'

interface DocumentSectionProps {
  stepNumber: number
  title: string
  documents: DocumentUploadResponse[]
  selectedId: number | null
  onSelect: (id: number | null) => void
  onUpload: (file: File) => void
  onDeleteRequest: (id: number) => void
  uploadHint: string
  emptyText: string
  className?: string
}

export function DocumentSection({
  stepNumber,
  title,
  documents,
  selectedId,
  onSelect,
  onUpload,
  onDeleteRequest,
  uploadHint,
  emptyText,
  className,
}: DocumentSectionProps) {
  // Column definitions with delete action — defined inside component to access onDeleteRequest
  const columns: Column<DocumentUploadResponse>[] = [
    { key: 'originalName', header: 'File Name' },
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
      render: (_val, record) => (
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
    <div className={`rounded-lg border p-4 ${className ?? ''}`}>
      <h4 className="text-lg font-medium mb-3">
        {stepNumber}. {title}
      </h4>
      <DataTable
        columns={columns}
        data={documents}
        rowKey="id"
        emptyText={emptyText}
        rowSelection={{
          selectedKeys: selectedId !== null ? [selectedId] : [],
          onChange: (keys) => onSelect(keys.length > 0 ? (keys[keys.length - 1] as number) : null),
        }}
      />
      <div className="mt-3">
        <FileUploadDropzone
          accept=".pdf"
          files={[]}
          onFilesChange={(f) => f[0] && onUpload(f[0])}
          hint={uploadHint}
        />
      </div>
    </div>
  )
}

// Inline type re-export for consumers who only import from this module
export type { DocumentSectionProps }
