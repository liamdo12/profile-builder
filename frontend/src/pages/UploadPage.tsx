import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FileUploadDropzone } from '@/components/shared/file-upload-dropzone'
import { PageHeader } from '@/components/shared/page-header'
import { uploadDocument } from '../api/documentApi'
import type { DocumentType } from '../types/document'

export default function UploadPage() {
  const navigate = useNavigate()
  const [files, setFiles] = useState<File[]>([])
  const [documentType, setDocumentType] = useState<DocumentType | undefined>(undefined)
  const [uploading, setUploading] = useState(false)

  const handleUpload = async () => {
    if (!files.length) {
      toast.warning('Please select a file')
      return
    }
    if (!documentType) {
      toast.warning('Please select a document type')
      return
    }

    const rawFile = files[0]
    if (!rawFile) {
      toast.error('Unable to read the selected file. Please re-select it.')
      return
    }
    setUploading(true)

    try {
      await uploadDocument(rawFile, documentType)
      toast.success('Document uploaded successfully')
      navigate('/')
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      toast.error(error?.response?.data?.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="mx-auto max-w-full sm:max-w-xl">
      <PageHeader
        title="Upload Document"
        subtitle="Upload your resume or cover letter (PDF, DOC, DOCX — max 2MB)"
      />

      <Card>
        <CardContent className="space-y-6 pt-6">
          <div>
            <p className="text-sm font-medium mb-2">Document Type</p>
            <Select
              value={documentType || ''}
              onValueChange={(val) => setDocumentType(val as DocumentType)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="RESUME">Resume</SelectItem>
                <SelectItem value="COVER_LETTER">Cover Letter</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <FileUploadDropzone
            accept=".pdf,.doc,.docx"
            files={files}
            onFilesChange={setFiles}
            hint="Supports PDF, DOC, DOCX — max 2MB"
          />

          <Button
            className="w-full"
            size="lg"
            disabled={!files.length || !documentType || uploading}
            onClick={handleUpload}
          >
            {uploading ? 'Uploading...' : 'Upload Document'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
