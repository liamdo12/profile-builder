import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Table, Button, Tag, Select, Space, Typography, App as AntApp,
} from 'antd';
import { UploadOutlined, FileTextOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { fetchDocuments } from '../api/documentApi';
import type { DocumentType, DocumentUploadResponse } from '../types/document';

const { Title } = Typography;

function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

export default function DocumentListPage() {
    const navigate = useNavigate();
    const { message } = AntApp.useApp();
    const [documents, setDocuments] = useState<DocumentUploadResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState<DocumentType | undefined>(undefined);

    const loadDocuments = async () => {
        setLoading(true);
        try {
            const data = await fetchDocuments(filter);
            setDocuments(data);
        } catch {
            message.error('Failed to load documents');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDocuments();
    }, [filter]);

    const columns: ColumnsType<DocumentUploadResponse> = [
        {
            title: 'Name',
            dataIndex: 'originalName',
            key: 'originalName',
            render: (text: string) => (
                <Space>
                    <FileTextOutlined />
                    {text}
                </Space>
            ),
        },
        {
            title: 'Type',
            dataIndex: 'documentType',
            key: 'documentType',
            width: 150,
            render: (type: DocumentType) => (
                <Tag color={type === 'RESUME' ? 'blue' : 'green'}>
                    {type === 'RESUME' ? 'Resume' : 'Cover Letter'}
                </Tag>
            ),
        },
        {
            title: 'Format',
            dataIndex: 'fileType',
            key: 'fileType',
            width: 120,
            render: (type: string) => {
                const label = type?.includes('pdf') ? 'PDF' : type?.includes('word') ? 'DOC' : type;
                return <Tag>{label}</Tag>;
            },
        },
        {
            title: 'Size',
            dataIndex: 'fileSize',
            key: 'fileSize',
            width: 100,
            render: (size: number) => formatBytes(size),
        },
        {
            title: 'Uploaded',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 180,
            render: (date: string) =>
                new Date(date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                }),
        },
    ];

    return (
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '40px 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <Title level={3} style={{ margin: 0 }}>
                    My Documents
                </Title>
                <Button
                    type="primary"
                    icon={<UploadOutlined />}
                    size="large"
                    onClick={() => navigate('/upload')}
                >
                    Upload New Document
                </Button>
            </div>

            <Space style={{ marginBottom: 16 }}>
                <span>Filter by type:</span>
                <Select
                    allowClear
                    placeholder="All types"
                    style={{ width: 180 }}
                    value={filter}
                    onChange={(val) => setFilter(val)}
                    options={[
                        { label: 'Resume', value: 'RESUME' },
                        { label: 'Cover Letter', value: 'COVER_LETTER' },
                    ]}
                />
            </Space>

            <Table
                rowKey="id"
                columns={columns}
                dataSource={documents}
                loading={loading}
                pagination={{ pageSize: 10 }}
                locale={{ emptyText: 'No documents uploaded yet' }}
            />
        </div>
    );
}
