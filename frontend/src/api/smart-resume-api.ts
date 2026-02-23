import { axiosInstance } from './axios-instance';
import type { SmartGeneratedResumeResponse, RecommendationItem } from '../types/smart-resume';

export async function generateSmartResume(
  jdFile: File,
  documentIds: number[],
): Promise<SmartGeneratedResumeResponse> {
  const formData = new FormData();
  formData.append('jdFile', jdFile);
  documentIds.forEach(id => formData.append('documentIds', id.toString()));
  const { data } = await axiosInstance.post<SmartGeneratedResumeResponse>('/smart-resume/generate', formData);
  return data;
}

export async function getSmartResume(id: number): Promise<SmartGeneratedResumeResponse> {
  const { data } = await axiosInstance.get<SmartGeneratedResumeResponse>(`/smart-resume/${id}`);
  return data;
}

export async function regenerateSmartResume(id: number): Promise<SmartGeneratedResumeResponse> {
  const { data } = await axiosInstance.post<SmartGeneratedResumeResponse>(`/smart-resume/${id}/regenerate`);
  return data;
}

export async function downloadSmartResumeDocx(id: number): Promise<Blob> {
  const { data } = await axiosInstance.get(`/smart-resume/${id}/download-docx`, {
    responseType: 'blob',
  });
  return data;
}

export async function applyRecommendations(
  id: number,
  recommendations: RecommendationItem[],
): Promise<SmartGeneratedResumeResponse> {
  const { data } = await axiosInstance.post<SmartGeneratedResumeResponse>(
    `/smart-resume/${id}/apply-recommendations`,
    { recommendations },
  );
  return data;
}
