import { axiosInstance } from './axios-instance';
import type { CoverLetterResponse } from '../types/cover-letter';

export async function generateCoverLetter(
  jdFile: File,
  resumeDocId: number,
  coverLetterDocId: number,
): Promise<CoverLetterResponse> {
  const formData = new FormData();
  formData.append('jdFile', jdFile);
  formData.append('resumeDocId', resumeDocId.toString());
  formData.append('coverLetterDocId', coverLetterDocId.toString());
  const { data } = await axiosInstance.post<CoverLetterResponse>('/cover-letter/generate', formData);
  return data;
}

export async function getCoverLetter(id: number): Promise<CoverLetterResponse> {
  const { data } = await axiosInstance.get<CoverLetterResponse>(`/cover-letter/${id}`);
  return data;
}

export async function evaluateCoverLetter(id: number): Promise<CoverLetterResponse> {
  const { data } = await axiosInstance.post<CoverLetterResponse>(`/cover-letter/${id}/evaluate`);
  return data;
}
