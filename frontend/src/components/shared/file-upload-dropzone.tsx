import { useRef, useState, useCallback } from 'react'
import { Upload, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface FileUploadDropzoneProps {
  accept?: string
  maxFiles?: number
  files: File[]
  onFilesChange: (files: File[]) => void
  disabled?: boolean
  hint?: string
}

export function FileUploadDropzone({
  accept,
  maxFiles = 1,
  files,
  onFilesChange,
  disabled = false,
  hint,
}: FileUploadDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const acceptExtensions = accept?.split(',').map((ext) => ext.trim().toLowerCase()) ?? []

  const isAccepted = useCallback(
    (file: File) => {
      if (acceptExtensions.length === 0) return true
      const fileName = file.name.toLowerCase()
      return acceptExtensions.some((ext) => fileName.endsWith(ext))
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [accept]
  )

  const handleFiles = useCallback(
    (incoming: FileList | File[]) => {
      const valid = Array.from(incoming).filter(isAccepted)
      if (valid.length === 0) return
      const next = maxFiles === 1 ? [valid[0]] : [...files, ...valid].slice(0, maxFiles)
      onFilesChange(next)
    },
    [files, maxFiles, isAccepted, onFilesChange]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      if (disabled) return
      handleFiles(e.dataTransfer.files)
    },
    [disabled, handleFiles]
  )

  const removeFile = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index))
  }

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(e) => e.key === 'Enter' && !disabled && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); if (!disabled) setIsDragging(true) }}
        onDragEnter={(e) => { e.preventDefault(); if (!disabled) setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          'flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition-colors cursor-pointer',
          'border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/5',
          isDragging && 'border-primary/50 bg-primary/5',
          disabled && 'cursor-not-allowed opacity-50',
        )}
      >
        <Upload className="h-10 w-10 text-muted-foreground/50 mb-3" />
        <p className="text-sm font-medium">Click or drag file to this area</p>
        {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={maxFiles > 1}
        className="hidden"
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
      />

      {files.length > 0 && (
        <div className="mt-3 space-y-2">
          {files.map((file, i) => (
            <div key={`${file.name}-${i}`} className="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
              <span className="truncate">{file.name}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={(e) => { e.stopPropagation(); removeFile(i) }}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
