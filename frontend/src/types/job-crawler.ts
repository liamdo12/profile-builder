export interface JobSearch {
  id: number
  jobTitle: string
  location: string
  remoteOnly: boolean
  datePostedWithinDays: number
  enabled: boolean
  createdAt: string
}

export interface JobSearchRequest {
  jobTitle: string
  location: string
  remoteOnly: boolean
  datePostedWithinDays: number
}

export interface TelegramConfig {
  id: number
  chatId: string
  enabled: boolean
  verified: boolean
}

export interface TelegramConfigRequest {
  chatId: string
}

export interface CrawlSchedule {
  id: number
  intervalHours: number
  enabled: boolean
  lastCrawlAt: string | null
  nextCrawlAt: string | null
}

export interface CrawlScheduleRequest {
  intervalHours: number
  enabled: boolean
}

export interface CrawledJob {
  id: number
  title: string
  company: string
  location: string
  salaryInfo: string | null
  datePosted: string
  description: string
  sourceUrl: string
  sourceSite: 'LINKEDIN' | 'INDEED' | 'GITHUB'
  createdAt: string
}

export interface PaginatedResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}
