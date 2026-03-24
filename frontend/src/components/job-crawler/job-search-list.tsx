import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { deleteJobSearch, toggleJobSearch } from '@/api/job-crawler-api'
import { toast } from 'sonner'
import { Trash2, ToggleLeft, ToggleRight } from 'lucide-react'
import type { JobSearch } from '@/types/job-crawler'

interface JobSearchListProps {
  searches: JobSearch[]
  onRefresh: () => void
}

export function JobSearchList({ searches, onRefresh }: JobSearchListProps) {
  async function handleToggle(search: JobSearch) {
    try {
      await toggleJobSearch(search.id)
      onRefresh()
    } catch {
      toast.error('Failed to toggle search')
    }
  }

  async function handleDelete(id: number) {
    try {
      await deleteJobSearch(id)
      toast.success('Search deleted')
      onRefresh()
    } catch {
      toast.error('Failed to delete search')
    }
  }

  if (searches.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        No job searches configured. Add one above to get started.
      </p>
    )
  }

  return (
    <div className="space-y-2">
      {searches.map((search) => (
        <Card key={search.id}>
          <CardContent className="flex items-center justify-between p-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-medium">{search.jobTitle}</span>
              {search.location && (
                <span className="text-sm text-muted-foreground">| {search.location}</span>
              )}
              {search.remoteOnly && <Badge variant="secondary">Remote</Badge>}
              <Badge variant="outline">{search.datePostedWithinDays}d</Badge>
              <Badge variant={search.enabled ? 'default' : 'secondary'}>
                {search.enabled ? 'Active' : 'Paused'}
              </Badge>
            </div>

            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={() => handleToggle(search)} title="Toggle">
                {search.enabled
                  ? <ToggleRight className="h-4 w-4 text-green-500" />
                  : <ToggleLeft className="h-4 w-4 text-muted-foreground" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(search.id)} title="Delete">
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
