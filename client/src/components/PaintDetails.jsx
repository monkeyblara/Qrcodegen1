import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PaintDetails.css';

function PaintDetails({ paintId }) {
  const [paint, setPaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPaint = async () => {
      try {
        const response = await axios.get(`/api/saved-paints/${paintId}`);
        setPaint(response.data);
        setError(null);
      } catch (err) {
        setError('Paint not found or server error');
        console.error('Error fetching paint:', err);
      } finally {
        setLoading(false);
      }
    };

    if (paintId) {
      fetchPaint();
    }
  }, [paintId]);

  if (loading) {
    return <div className="paint-details-page loading">Loading paint details...</div>;
  }

  if (error || !paint) {
    return (
      <div className="paint-details-page error">
        <h1>❌ Error</h1>
        <p>{error || 'Paint not found'}</p>
      </div>
    );
  }

  return (
    <div className="paint-details-page">
      <div className="details-card">
        <h1>🎨 Paint Template Information</h1>
        
        <div className="detail-section">
          <h2>Paint Name</h2>
          <p>{paint.name}</p>
        </div>

        <div className="detail-section">
          <h2>Brand</h2>
          <p>{paint.brand}</p>
        </div>

        <div className="detail-section">
          <h2>Paint Type</h2>
          <p>{paint.paintType}</p>
        </div>

        <div className="detail-section">
          <h2>Quantity</h2>
          <p>{paint.quantity}</p>
        </div>

        <div className="detail-section">
          <h2>Color</h2>
          <div style={{ display: 'inline-block', width: '48px', height: '48px', backgroundColor: paint.color, border: '2px solid #ccc', borderRadius: '4px' }}></div>
          <p style={{ marginTop: '8px' }}>{paint.color}</p>
        </div>

        <div className="detail-section">
          <h2>Added On</h2>
          <p>{new Date(paint.createdAt).toLocaleString()}</p>
        </div>

        {paint.updatedAt && paint.updatedAt !== paint.createdAt && (
          <div className="detail-section">
            <h2>Last Updated</h2>
            <p>{new Date(paint.updatedAt).toLocaleString()}</p>
          </div>
        )}

        <div className="action-buttons">
          <button onClick={() => window.print()} className="btn-print">
            🖨️ Print
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaintDetails;
