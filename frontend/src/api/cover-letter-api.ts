import axios from 'axios';
import { API_BASE_URL } from '../config';
import type { CoverLetterResponse } from '../types/cover-letter';

const api = axios.create({ baseURL: API_BASE_URL, timeout: 180000 });

export async function generateCoverLetter(
  jdFile: File,
  resumeDocId: number,
  coverLetterDocId: number,
): Promise<CoverLetterResponse> {
  const formData = new FormData();
  formData.append('jdFile', jdFile);
  formData.append('resumeDocId', resumeDocId.toString());
  formData.append('coverLetterDocId', coverLetterDocId.toString());
  const { data } = await api.post<CoverLetterResponse>('/cover-letter/generate', formData);
  return data;
}

export async function getCoverLetter(id: number): Promise<CoverLetterResponse> {
  const { data } = await api.get<CoverLetterResponse>(`/cover-letter/${id}`);
  return data;
}

export async function evaluateCoverLetter(id: number): Promise<CoverLetterResponse> {
  const { data } = await api.post<CoverLetterResponse>(`/cover-letter/${id}/evaluate`);
  return data;
}
