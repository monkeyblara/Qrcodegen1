import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
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

  const handleDownload = (format) => {
    const qrElement = document.querySelector('#qr-code-ref');
    const svg = qrElement.querySelector('svg');
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);
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
      const dataUrl = canvas.toDataURL(`image/${format}`);
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `${chemical.serialNumber}.${format}`;
      link.click();
    };

    image.src = url;
  };

  const handlePrint = () => {
    const qrElement = document.querySelector('#qr-code-ref');
    const svg = qrElement.querySelector('svg');
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);
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
          <body style="display: flex; flex-direction: column; align-items: center; padding: 20px;">
            <h2>${chemical.chemicalName}</h2>
            <p><strong>Serial Number:</strong> ${chemical.serialNumber}</p>
            <p><strong>Manufacturer:</strong> ${chemical.manufacturer}</p>
            <img src="${imgData}" />
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
        <div className="details-section">
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
        </div>

        <div className="qr-section">
          <h2>QR Code</h2>
          <div id="qr-code-ref" className="qr-code-container">
            <QRCode 
              value={`${window.location.origin}/chemical/${chemical.id}`}
              size={256}
              bgColor="#ffffff"
              fgColor="#000000"
              level="H"
            />
          </div>
          
          <div className="qr-actions">
            <button className="btn btn-secondary" onClick={() => handleDownload('png')}>
              📥 Download PNG
            </button>
            <button className="btn btn-secondary" onClick={() => handleDownload('jpg')}>
              📥 Download JPG
            </button>
            <button className="btn btn-secondary" onClick={handlePrint}>
              🖨️ Print
            </button>
            <a href="/" className="btn btn-secondary">
              ← Back
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChemicalDetails;
