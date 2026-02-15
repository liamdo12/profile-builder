export type DocumentType = 'RESUME' | 'COVER_LETTER';

export interface DocumentUploadResponse {
  id: number;
  fileName: string;
  originalName: string;
  filePath: string;
  fileType: string;
  documentType: DocumentType;
  fileSize: number;
  createdAt: string;
}
