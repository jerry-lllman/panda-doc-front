import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface Document {
  id: string;
  title: string;
  content: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const DocumentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await fetch(`/api/documents/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch document');
        }

        const data = await response.json();
        setDocument(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [id]);

  if (loading) return <div>Loading document...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!document) return <div>Document not found</div>;

  return (
    <div className="document-page">
      <h1>{document.title}</h1>
      <div className="document-metadata">
        <p>Created by: {document.createdBy}</p>
        <p>Created: {new Date(document.createdAt).toLocaleDateString()}</p>
        <p>Last updated: {new Date(document.updatedAt).toLocaleDateString()}</p>
      </div>
      <div className="document-content">
        {document.content}
      </div>
    </div>
  );
};

export default DocumentPage; 