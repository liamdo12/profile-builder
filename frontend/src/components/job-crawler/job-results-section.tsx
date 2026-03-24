import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { listCrawledJobs, deleteCrawledJob } from '@/api/job-crawler-api'
import { toast } from 'sonner'
import { ExternalLink, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import type { CrawledJob, PaginatedResponse } from '@/types/job-crawler'

const SOURCE_OPTIONS = [
  { value: 'ALL', label: 'All Sources' },
  { value: 'LINKEDIN', label: 'LinkedIn' },
  { value: 'INDEED', label: 'Indeed' },
  { value: 'GITHUB', label: 'GitHub' },
]

const SOURCE_COLORS: Record<string, string> = {
  LINKEDIN: 'bg-blue-600',
  INDEED: 'bg-purple-600',
  GITHUB: 'bg-gray-700',
}

export function JobResultsSection() {
  const [jobs, setJobs] = useState<PaginatedResponse<CrawledJob> | null>(null)
  const [sourceFilter, setSourceFilter] = useState('ALL')
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)

  const loadJobs = useCallback(async () => {
    setLoading(true)
    try {
      const source = sourceFilter === 'ALL' ? undefined : sourceFilter
      setJobs(await listCrawledJobs(page, 20, source))
    } catch {
      toast.error('Failed to load jobs')
    } finally {
      setLoading(false)
    }
  }, [sourceFilter, page])

  useEffect(() => {
    loadJobs()
  }, [loadJobs])

  async function handleDelete(id: number) {
    try {
      await deleteCrawledJob(id)
      toast.success('Job removed')
      loadJobs()
    } catch {
      toast.error('Failed to delete job')
    }
  }

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString()
  }

  return (
    <div className="space-y-3">
      {/* Filter bar */}
      <div className="flex items-center justify-between">
        <Select value={sourceFilter} onValueChange={(v) => { setSourceFilter(v); setPage(0) }}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SOURCE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {jobs && (
          <span className="text-sm text-muted-foreground">
            {jobs.totalElements} job{jobs.totalElements !== 1 ? 's' : ''} found
          </span>
        )}
      </div>

      {/* Table */}
      {loading ? (
        <p className="py-8 text-center text-sm text-muted-foreground">Loading...</p>
      ) : !jobs || jobs.content.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No jobs found. Configure a search and enable scheduling to start crawling.
        </p>
      ) : (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead className="hidden md:table-cell">Location</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead className="hidden sm:table-cell">Date</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.content.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell>
                      <a
                        href={job.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-primary hover:underline"
                      >
                        {job.title}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </TableCell>
                    <TableCell>{job.company ?? '-'}</TableCell>
                    <TableCell className="hidden md:table-cell">{job.location ?? '-'}</TableCell>
                    <TableCell>
                      <Badge className={SOURCE_COLORS[job.sourceSite] ?? ''}>
                        {job.sourceSite}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{formatDate(job.datePosted)}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(job.id)}>
                        <Trash2 className="h-3 w-3 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline" size="sm"
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="mr-1 h-3 w-3" /> Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {jobs.number + 1} of {jobs.totalPages || 1}
            </span>
            <Button
              variant="outline" size="sm"
              disabled={page >= (jobs.totalPages - 1)}
              onClick={() => setPage((p) => p + 1)}
            >
              Next <ChevronRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
