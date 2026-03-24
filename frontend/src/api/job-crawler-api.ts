import { axiosInstance } from './axios-instance'
import type {
  JobSearch,
  JobSearchRequest,
  TelegramConfig,
  TelegramConfigRequest,
  CrawlSchedule,
  CrawlScheduleRequest,
  CrawledJob,
  PaginatedResponse,
} from '../types/job-crawler'

// ── Job Searches ─────────────────────────────────────────

export async function createJobSearch(req: JobSearchRequest): Promise<JobSearch> {
  const { data } = await axiosInstance.post<JobSearch>('/job-searches', req)
  return data
}

export async function listJobSearches(): Promise<JobSearch[]> {
  const { data } = await axiosInstance.get<JobSearch[]>('/job-searches')
  return data
}

export async function updateJobSearch(id: number, req: Partial<JobSearchRequest>): Promise<JobSearch> {
  const { data } = await axiosInstance.put<JobSearch>(`/job-searches/${id}`, req)
  return data
}

export async function toggleJobSearch(id: number): Promise<void> {
  await axiosInstance.patch(`/job-searches/${id}/toggle`)
}

export async function deleteJobSearch(id: number): Promise<void> {
  await axiosInstance.delete(`/job-searches/${id}`)
}

// ── Telegram Config ──────────────────────────────────────

export async function getTelegramConfig(): Promise<TelegramConfig | null> {
  const resp = await axiosInstance.get<TelegramConfig>('/telegram')
  return resp.status === 204 ? null : resp.data
}

export async function saveTelegramConfig(req: TelegramConfigRequest): Promise<TelegramConfig> {
  const { data } = await axiosInstance.post<TelegramConfig>('/telegram', req)
  return data
}

export async function verifyTelegram(): Promise<TelegramConfig> {
  const { data } = await axiosInstance.post<TelegramConfig>('/telegram/verify')
  return data
}

export async function deleteTelegramConfig(): Promise<void> {
  await axiosInstance.delete('/telegram')
}

// ── Crawl Schedule ───────────────────────────────────────

export async function getCrawlSchedule(): Promise<CrawlSchedule> {
  const { data } = await axiosInstance.get<CrawlSchedule>('/crawl-schedule')
  return data
}

export async function updateCrawlSchedule(req: CrawlScheduleRequest): Promise<CrawlSchedule> {
  const { data } = await axiosInstance.put<CrawlSchedule>('/crawl-schedule', req)
  return data
}

// ── Crawled Jobs ─────────────────────────────────────────

export async function listCrawledJobs(
  page: number,
  size: number,
  sourceSite?: string,
): Promise<PaginatedResponse<CrawledJob>> {
  const params: Record<string, string | number> = { page, size }
  if (sourceSite) params.sourceSite = sourceSite
  const { data } = await axiosInstance.get<PaginatedResponse<CrawledJob>>('/crawled-jobs', { params })
  return data
}

export async function triggerCrawlNow(): Promise<void> {
  await axiosInstance.post('/crawled-jobs/crawl-now')
}

export async function deleteCrawledJob(id: number): Promise<void> {
  await axiosInstance.delete(`/crawled-jobs/${id}`)
}
