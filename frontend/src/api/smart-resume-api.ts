import axios from 'axios';
import { API_BASE_URL } from '../config';
import type { SmartGeneratedResumeResponse, RecommendationItem } from '../types/smart-resume';

const api = axios.create({ baseURL: API_BASE_URL, timeout: 180000 });

export async function generateSmartResume(
  jdFile: File,
  documentIds: number[],
): Promise<SmartGeneratedResumeResponse> {
  const formData = new FormData();
  formData.append('jdFile', jdFile);
  documentIds.forEach(id => formData.append('documentIds', id.toString()));
  const { data } = await api.post<SmartGeneratedResumeResponse>('/smart-resume/generate', formData);
  return data;
}

export async function getSmartResume(id: number): Promise<SmartGeneratedResumeResponse> {
  const { data } = await api.get<SmartGeneratedResumeResponse>(`/smart-resume/${id}`);
  return data;
}

export async function regenerateSmartResume(id: number): Promise<SmartGeneratedResumeResponse> {
  const { data } = await api.post<SmartGeneratedResumeResponse>(`/smart-resume/${id}/regenerate`);
  return data;
}

export async function downloadSmartResumeDocx(id: number): Promise<Blob> {
  const { data } = await api.get(`/smart-resume/${id}/download-docx`, {
    responseType: 'blob',
  });
  return data;
}

export async function applyRecommendations(
  id: number,
  recommendations: RecommendationItem[],
): Promise<SmartGeneratedResumeResponse> {
  const { data } = await api.post<SmartGeneratedResumeResponse>(
    `/smart-resume/${id}/apply-recommendations`,
    { recommendations },
  );
  return data;
}
