import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Upload, Button, Select, Typography, Card, Space, App as AntApp,
} from 'antd';
import { InboxOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd';
import { uploadDocument } from '../api/documentApi';
import type { DocumentType } from '../types/document';

const { Title, Text } = Typography;
const { Dragger } = Upload;

export default function UploadPage() {
    const navigate = useNavigate();
    const { message } = AntApp.useApp();
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [documentType, setDocumentType] = useState<DocumentType | undefined>(undefined);
    const [uploading, setUploading] = useState(false);

    const handleUpload = async () => {
        if (!fileList.length) {
            message.warning('Please select a file');
            return;
        }
        if (!documentType) {
            message.warning('Please select a document type');
            return;
        }

        const rawFile = fileList[0]?.originFileObj;
        if (!rawFile) {
            message.error('Unable to read the selected file. Please re-select it.');
            return;
        }
        setUploading(true);

        try {
            await uploadDocument(rawFile, documentType);
            message.success('Document uploaded successfully');
            navigate('/');
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            message.error(error?.response?.data?.message || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div style={{ maxWidth: 600, margin: '0 auto', padding: '40px 24px' }}>
            <Button
                type="link"
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate('/')}
                style={{ marginBottom: 16, padding: 0 }}
            >
                Back to Documents
            </Button>

            <Title level={3}>Upload Document</Title>
            <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
                Upload your resume or cover letter (PDF, DOC, DOCX — max 2MB)
            </Text>

            <Card>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <div>
                        <Text strong style={{ display: 'block', marginBottom: 8 }}>Document Type</Text>
                        <Select
                            placeholder="Select type"
                            style={{ width: '100%' }}
                            value={documentType}
                            onChange={setDocumentType}
                            options={[
                                { label: 'Resume', value: 'RESUME' },
                                { label: 'Cover Letter', value: 'COVER_LETTER' },
                            ]}
                        />
                    </div>

                    <Dragger
                        fileList={fileList}
                        beforeUpload={() => false}
                        onChange={({ fileList: newList }) => setFileList(newList.slice(-1))}
                        accept=".pdf,.doc,.docx"
                        maxCount={1}
                    >
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">Click or drag file to this area</p>
                        <p className="ant-upload-hint">
                            Supports PDF, DOC, DOCX — max 2MB
                        </p>
                    </Dragger>

                    <Button
                        type="primary"
                        size="large"
                        block
                        loading={uploading}
                        onClick={handleUpload}
                        disabled={!fileList.length || !documentType}
                    >
                        {uploading ? 'Uploading...' : 'Upload Document'}
                    </Button>
                </Space>
            </Card>
        </div>
    );
}
