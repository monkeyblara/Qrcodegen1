import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ChemicalDetails.css';

function ChemicalDetails({ chemicalId }) {
  const [chemical, setChemical] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchChemical();
  }, [chemicalId]);

  const fetchChemical = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/chemicals/${chemicalId}`);
      const chemical = { ...response.data, id: response.data._id };
      setChemical(chemical);
      setError(null);
    } catch (err) {
      console.error('Error fetching chemical:', err);
      setError('Chemical not found');
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };



  if (loading) {
    return <div className="chemical-details-loading">Loading chemical details...</div>;
  }

  if (error || !chemical) {
    return (
      <div className="chemical-details-error">
        <h2>⚠️ Chemical Not Found</h2>
        <p>{error || 'The chemical you are looking for does not exist.'}</p>
        <a href="/" className="back-link">← Back to Home</a>
      </div>
    );
  }

  return (
    <div className="chemical-details-page">
      <div className="chemical-details-container">
        <div className="details-section full-width">
          <h2>🧪 Chemical Details</h2>
          
          <div className="detail-card">
            <div className="detail-item">
              <span className="detail-label">Serial Number:</span>
              <span className="detail-value">{chemical.serialNumber}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Chemical Name:</span>
              <span className="detail-value">{chemical.chemicalName}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Manufacturer:</span>
              <span className="detail-value">{chemical.manufacturer}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Type:</span>
              <span className={`type-badge ${chemical.chemicalType}`}>{chemical.chemicalType}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Quantity:</span>
              <span className="detail-value">{chemical.quantity} {chemical.unit}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Hazard Level:</span>
              <span className={`hazard-badge ${chemical.hazardLevel}`}>{chemical.hazardLevel}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Storage Location:</span>
              <span className="detail-value">{chemical.storageLocation}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Expiry Date:</span>
              <span className="detail-value">{chemical.expiryDate}</span>
            </div>
          </div>

          <div className="back-button">
            <a href="/" className="btn btn-primary">
              ← Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChemicalDetails;
