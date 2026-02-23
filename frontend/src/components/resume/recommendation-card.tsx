import { useState } from 'react'
import DOMPurify from 'dompurify'
import { Copy, Check } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import type { RecommendationItem } from '@/types/smart-resume'

interface RecommendationCardProps {
  recommendation: RecommendationItem
  selected?: boolean
  onToggle?: () => void
}

// Badge color config per recommendation type
const typeBadgeClass: Record<RecommendationItem['type'], string> = {
  modify: 'bg-blue-500/10 text-blue-500',
  add: 'bg-green-500/10 text-green-500',
  remove: 'bg-red-500/10 text-red-500',
}

// Individual recommendation card with optional checkbox selection and copy-to-clipboard
export function RecommendationCard({ recommendation: rec, selected, onToggle }: RecommendationCardProps) {
  const [copied, setCopied] = useState(false)

  // Strip all HTML tags for plain text copy
  const plainText = rec.suggested.replace(/<[^>]*>/g, '')

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(plainText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback: clipboard API requires secure context (HTTPS)
    }
  }

  const showOriginal = rec.type === 'modify' || rec.type === 'remove'

  return (
    <Card className={`border ${selected ? 'border-primary/50 bg-primary/5' : 'border-border/60'}`}>
      <CardContent className="pt-4 pb-4 px-4">
        {/* Header: optional checkbox + section badge + type badge + copy button */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {onToggle && (
            <Checkbox
              checked={selected}
              onCheckedChange={onToggle}
              className="shrink-0"
            />
          )}
          <Badge variant="secondary" className="text-xs">{rec.section}</Badge>
          <Badge variant="secondary" className={`text-xs capitalize ${typeBadgeClass[rec.type]}`}>
            {rec.type}
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto h-7 w-7 shrink-0"
            onClick={handleCopy}
            title="Copy suggested text"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
          </Button>
        </div>

        {/* Original text (for modify / remove) */}
        {showOriginal && rec.original && (
          <p className="text-sm line-through text-muted-foreground mb-2">{rec.original}</p>
        )}

        {/* Suggested text rendered with bold support */}
        <p
          className="text-sm mb-2"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(rec.suggested) }}
        />

        {/* Reason */}
        <p className="text-xs text-muted-foreground">{rec.reason}</p>
      </CardContent>
    </Card>
  )
}
