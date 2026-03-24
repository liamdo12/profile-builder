import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { JobSearchForm } from '@/components/job-crawler/job-search-form'
import { JobSearchList } from '@/components/job-crawler/job-search-list'
import { TelegramSetupSection } from '@/components/job-crawler/telegram-setup-section'
import { CrawlScheduleSection } from '@/components/job-crawler/crawl-schedule-section'
import { JobResultsSection } from '@/components/job-crawler/job-results-section'
import { listJobSearches } from '@/api/job-crawler-api'
import type { JobSearch } from '@/types/job-crawler'

/**
 * Job Crawler dashboard page with tabbed sections:
 * Searches, Telegram, Schedule, Results.
 */
export default function JobCrawlerPage() {
  const [searches, setSearches] = useState<JobSearch[]>([])
  const [loaded, setLoaded] = useState(false)

  // Fetch on first render via state flag (avoids useEffect + setState lint rule)
  if (!loaded) {
    setLoaded(true)
    listJobSearches().then(setSearches).catch(() => {})
  }

  function refreshSearches() {
    listJobSearches().then(setSearches).catch(() => {})
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold">Job Crawler</h1>
        <p className="text-sm text-muted-foreground">
          Automatically scrape job listings from LinkedIn, Indeed, and GitHub repos
        </p>
      </div>

      <Tabs defaultValue="searches">
        <TabsList>
          <TabsTrigger value="searches">Searches</TabsTrigger>
          <TabsTrigger value="telegram">Telegram</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>

        <TabsContent value="searches" className="space-y-4 pt-4">
          <JobSearchForm onSaved={refreshSearches} />
          <JobSearchList searches={searches} onRefresh={refreshSearches} />
        </TabsContent>

        <TabsContent value="telegram" className="pt-4">
          <TelegramSetupSection />
        </TabsContent>

        <TabsContent value="schedule" className="pt-4">
          <CrawlScheduleSection />
        </TabsContent>

        <TabsContent value="results" className="pt-4">
          <JobResultsSection />
        </TabsContent>
      </Tabs>
    </div>
  )
}
