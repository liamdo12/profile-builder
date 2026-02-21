import { useState } from 'react'
import { Download } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

interface ResumeDownloadButtonProps {
  targetSelector: string
  fileName?: string
}

export function ResumeDownloadButton({
  targetSelector,
  fileName = 'resume.pdf',
}: ResumeDownloadButtonProps) {
  const [downloading, setDownloading] = useState(false)

  const handleDownload = async () => {
    const element = document.querySelector(targetSelector)
    if (!element) {
      toast.error('Resume element not found')
      return
    }

    setDownloading(true)
    try {
      const html2pdf = (await import('html2pdf.js')).default
      await html2pdf()
        .set({
          margin: 0,
          filename: fileName,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        })
        .from(element as HTMLElement)
        .save()
    } catch {
      toast.error('Failed to generate PDF')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <Button variant="outline" size="lg" disabled={downloading} onClick={handleDownload}>
      <Download className="h-4 w-4 mr-2" />
      {downloading ? 'Generating PDF...' : 'Download PDF'}
    </Button>
  )
}
