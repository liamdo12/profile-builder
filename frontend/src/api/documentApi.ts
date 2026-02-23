import { axiosInstance } from './axios-instance';
import type { DocumentType, DocumentUploadResponse } from '../types/document';

export async function fetchDocuments(documentType?: DocumentType): Promise<DocumentUploadResponse[]> {
    const params = documentType ? { documentType } : {};
    const { data } = await axiosInstance.get<DocumentUploadResponse[]>('/documents', { params });
    return data;
}

export async function fetchDocumentById(id: number): Promise<DocumentUploadResponse> {
    const { data } = await axiosInstance.get<DocumentUploadResponse>(`/documents/${id}`);
    return data;
}

export async function uploadDocument(file: File, documentType: DocumentType): Promise<DocumentUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', documentType);

    const { data } = await axiosInstance.post<DocumentUploadResponse>('/documents/upload', formData);
    return data;
}
