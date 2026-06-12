import React, { useState, useEffect } from 'react';
import axios from 'axios';
import QRCode from 'react-qr-code';
import { getAppOrigin } from '../utils/getAppOrigin';
import './ChemicalDetails.css';

function ChemicalDetails({ chemicalId }) {
  const [chemical, setChemical] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchChemical();
  }, [chemicalId]);

  const handlePrint = () => {
    const qrElement = document.querySelector('#chemical-qr-code svg');
    if (!qrElement) {
      alert('Please wait for the QR code to render before printing.');
      return;
    }

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(qrElement);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    const image = new Image();

    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      const imgData = canvas.toDataURL('image/png');

      const printWindow = window.open('', '', 'width=800,height=600');
      printWindow.document.write(`
        <html>
          <head>
            <title>Print QR Code - ${chemical.serialNumber}</title>
          </head>
          <body style="display: flex; flex-direction: column; align-items: center; padding: 20px; font-family: Arial, sans-serif;">
            <h2 style="margin-bottom: 10px;">${chemical.chemicalName}</h2>
            <p style="margin: 4px 0;"><strong>Serial Number:</strong> ${chemical.serialNumber}</p>
            <img src="${imgData}" alt="QR Code" style="margin: 20px 0; width: 240px; height: 240px;" />
            <p style="margin-top: 20px; text-align: center;">
              <strong>Scan this QR code to view chemical details</strong>
            </p>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    };

    image.src = url;
  };

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

          <div className="qr-section">
            <h2>QR Code</h2>
            <div id="chemical-qr-code" className="qr-code-box">
              <QRCode
                value={`${getAppOrigin()}/chemical/${chemical.id}`}
                size={220}
                bgColor="#ffffff"
                fgColor="#000000"
                level="H"
              />
            </div>
            <div className="back-button">
              <button onClick={handlePrint} className="btn btn-primary">
                🖨️ Print QR Code
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChemicalDetails;
