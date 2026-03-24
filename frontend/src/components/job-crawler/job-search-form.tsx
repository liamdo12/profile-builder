import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createJobSearch } from '@/api/job-crawler-api'
import { toast } from 'sonner'
import type { JobSearchRequest } from '@/types/job-crawler'

interface JobSearchFormProps {
  onSaved: () => void
}

const DATE_OPTIONS = [
  { value: '1', label: '1 day' },
  { value: '3', label: '3 days' },
  { value: '7', label: '7 days' },
  { value: '14', label: '14 days' },
  { value: '30', label: '30 days' },
]

export function JobSearchForm({ onSaved }: JobSearchFormProps) {
  const [jobTitle, setJobTitle] = useState('')
  const [location, setLocation] = useState('')
  const [remoteOnly, setRemoteOnly] = useState(false)
  const [datePostedWithinDays, setDatePostedWithinDays] = useState('3')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!jobTitle.trim()) {
      toast.error('Job title is required')
      return
    }

    setSaving(true)
    try {
      const req: JobSearchRequest = {
        jobTitle: jobTitle.trim(),
        location: location.trim(),
        remoteOnly,
        datePostedWithinDays: parseInt(datePostedWithinDays),
      }
      await createJobSearch(req)
      toast.success('Job search created')
      setJobTitle('')
      setLocation('')
      setRemoteOnly(false)
      setDatePostedWithinDays('3')
      onSaved()
    } catch {
      toast.error('Failed to create job search')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border p-4">
      <h3 className="text-sm font-semibold">Add Job Search</h3>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Input
          placeholder="Job title (e.g., Software Engineer)"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          required
        />
        <Input
          placeholder="Location (e.g., San Francisco, CA)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Checkbox
            id="remoteOnly"
            checked={remoteOnly}
            onCheckedChange={(checked) => setRemoteOnly(checked === true)}
          />
          <label htmlFor="remoteOnly" className="text-sm">Remote only</label>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground">Posted within:</label>
          <Select value={datePostedWithinDays} onValueChange={setDatePostedWithinDays}>
            <SelectTrigger className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DATE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" disabled={saving} size="sm">
          {saving ? 'Adding...' : 'Add Search'}
        </Button>
      </div>
    </form>
  )
}
