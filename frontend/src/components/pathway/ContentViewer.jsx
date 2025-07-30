/**
 * @file ContentViewer.jsx
 * @description This component displays the content of a Link, Video, or Document item.
 * It fetches the content details based on type and ID and renders it appropriately.
 * @module components/pathway/ContentViewer
 * @requires react
 * @requires ../../services/link
 * @requires ../../services/video
 * @requires ../../services/document
 * @requires ../common/Loading
 * @requires ../common/Error
 * @requires antd
 */

import React, { useState, useEffect } from 'react';
import { getLinkById } from '../../services/link';
import { getVideoById } from '../../services/video';
import { getDocumentById } from '../../services/document';
import Loading from '../common/Loading';
import Error from '../common/Error';
import { Typography, Card, Space } from 'antd';

const { Title, Text } = Typography;

/**
 * @component ContentViewer
 * @description A component to display the content of a specific learning item (Link, Video, Document).
 * @param {object} props - The component props.
 * @param {string} props.itemType - The type of the item ('Link', 'Video', 'Document').
 * @param {string} props.itemId - The ID of the item to display.
 * @returns {JSX.Element} The content viewer component.
 */
const ContentViewer = ({ itemType, itemId }) => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    /**
     * @function fetchContent
     * @description Fetches the details of the content item based on its type and ID.
     * @returns {Promise<void>}
     */
    const fetchContent = async () => {
      try {
        let response;
        switch (itemType) {
          case 'Link':
            response = await getLinkById(itemId);
            break;
          case 'Video':
            response = await getVideoById(itemId);
            break;
          case 'Document':
            response = await getDocumentById(itemId);
            break;
          default:
            throw new Error('Invalid item type provided.');
        }
        setContent(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    if (itemId && itemType) {
      fetchContent();
    } else {
      setLoading(false);
      setError('No item selected for viewing.');
    }
  }, [itemType, itemId]);

  if (loading) {
    return <Loading message="Loading content..." />;
  }

  if (error) {
    return <Error message={error} />;
  }

  if (!content) {
    return <Error message="Content not found." />;
  }

  return (
    <Card title={<Title level={4}>{content.title}</Title>}>
      <Space direction="vertical" style={{ width: '100%' }}>
        {itemType === 'Link' && (
          <>
            <Text strong>URL:</Text>
            <a href={content.url} target="_blank" rel="noopener noreferrer">{content.url}</a>
            {content.description && <Text>{content.description}</Text>}
          </>
        )}

        {itemType === 'Video' && (
          <>
            <div className="video-responsive" style={{ position: 'relative', paddingBottom: '56.25%', height: '0', overflow: 'hidden' }}>
              <iframe
                width="853"
                height="480"
                src={content.url}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={content.title}
                style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '100%' }}
              ></iframe>
            </div>
            {content.description && <Text>{content.description}</Text>}
            {content.duration && <Text>Duration: {content.duration} seconds</Text>}
          </>
        )}

        {itemType === 'Document' && (
          <>
            {/* For now, just display as pre-formatted text. Markdown rendering can be added later. */}
            <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', backgroundColor: '#f0f2f5', padding: '10px', borderRadius: '5px' }}>
              {content.content}
            </pre>
            {content.description && <Text>{content.description}</Text>}
          </>
        )}
      </Space>
    </Card>
  );
};

export default ContentViewer;
