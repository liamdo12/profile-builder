import axios from 'axios';
import { API_BASE_URL } from '../config';
import type { DocumentType, DocumentUploadResponse } from '../types/document';

const api = axios.create({
    baseURL: API_BASE_URL,
});

export async function fetchDocuments(documentType?: DocumentType): Promise<DocumentUploadResponse[]> {
    const params = documentType ? { documentType } : {};
    const { data } = await api.get<DocumentUploadResponse[]>('/documents', { params });
    return data;
}

export async function fetchDocumentById(id: number): Promise<DocumentUploadResponse> {
    const { data } = await api.get<DocumentUploadResponse>(`/documents/${id}`);
    return data;
}

export async function uploadDocument(file: File, documentType: DocumentType): Promise<DocumentUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', documentType);

    const { data } = await api.post<DocumentUploadResponse>('/documents/upload', formData);
    return data;
}
