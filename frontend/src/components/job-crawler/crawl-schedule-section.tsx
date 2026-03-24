import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { getCrawlSchedule, updateCrawlSchedule, triggerCrawlNow } from '@/api/job-crawler-api'
import { toast } from 'sonner'
import { Play, Clock } from 'lucide-react'
import type { CrawlSchedule } from '@/types/job-crawler'

const INTERVAL_OPTIONS = [
  { value: '1', label: 'Every 1 hour' },
  { value: '2', label: 'Every 2 hours' },
  { value: '3', label: 'Every 3 hours' },
  { value: '6', label: 'Every 6 hours' },
  { value: '12', label: 'Every 12 hours' },
  { value: '24', label: 'Every 24 hours' },
]

function formatDateTime(dateStr: string | null): string {
  if (!dateStr) return 'Never'
  return new Date(dateStr).toLocaleString()
}

export function CrawlScheduleSection() {
  const [schedule, setSchedule] = useState<CrawlSchedule | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [crawling, setCrawling] = useState(false)

  useEffect(() => {
    loadSchedule()
  }, [])

  async function loadSchedule() {
    try {
      setSchedule(await getCrawlSchedule())
    } catch {
      toast.error('Failed to load schedule')
    } finally {
      setLoading(false)
    }
  }

  async function handleUpdate(interval?: string, enabled?: boolean) {
    if (!schedule) return
    setSaving(true)
    try {
      const updated = await updateCrawlSchedule({
        intervalHours: interval ? parseInt(interval) : schedule.intervalHours,
        enabled: enabled !== undefined ? enabled : schedule.enabled,
      })
      setSchedule(updated)
      toast.success('Schedule updated')
    } catch {
      toast.error('Failed to update schedule')
    } finally {
      setSaving(false)
    }
  }

  async function handleCrawlNow() {
    setCrawling(true)
    try {
      await triggerCrawlNow()
      toast.success('Crawl triggered! Results will appear shortly.')
    } catch {
      toast.error('Failed to trigger crawl')
    } finally {
      setCrawling(false)
    }
  }

  if (loading) return <p className="text-sm text-muted-foreground">Loading...</p>

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Crawl Schedule</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <Select
            value={schedule?.intervalHours.toString() ?? '3'}
            onValueChange={(v) => handleUpdate(v)}
            disabled={saving}
          >
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {INTERVAL_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <Checkbox
              id="scheduleEnabled"
              checked={schedule?.enabled ?? false}
              onCheckedChange={(checked) => handleUpdate(undefined, checked === true)}
              disabled={saving}
            />
            <label htmlFor="scheduleEnabled" className="text-sm">Enable automatic crawling</label>
          </div>

          <Button onClick={handleCrawlNow} disabled={crawling} size="sm" variant="outline">
            <Play className="mr-1 h-3 w-3" />
            {crawling ? 'Triggering...' : 'Crawl Now'}
          </Button>
        </div>

        {schedule && (
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" /> Last crawl: {formatDateTime(schedule.lastCrawlAt)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" /> Next crawl: {formatDateTime(schedule.nextCrawlAt)}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
