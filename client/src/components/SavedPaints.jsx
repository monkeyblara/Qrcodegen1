import React, { useState, useEffect } from 'react';
import axios from 'axios';
import QRCode from 'react-qr-code';
import './SavedPaints.css';

function SavedPaints() {
  const [savedPaints, setSavedPaints] = useState([]);
  const [paintTypes, setPaintTypes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPaint, setEditingPaint] = useState(null);
  const [selectedPaint, setSelectedPaint] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    paintType: '',
    quantity: '',
    color: '#ffffff'
  });

  useEffect(() => {
    fetchSavedPaints();
    fetchPaintTypes();
  }, []);

  const normalizeId = (item) => item.id || item._id || (item._id ? item._id.toString() : undefined);
  const normalizeItems = (items) => items.map(item => ({ ...item, id: normalizeId(item) }));

  const fetchSavedPaints = async () => {
    try {
      const response = await axios.get('/api/saved-paints');
      setSavedPaints(normalizeItems(response.data));
    } catch (error) {
      console.error('Error fetching saved paints:', error);
    }
  };

  const fetchPaintTypes = async () => {
    try {
      const response = await axios.get('/api/paint-types');
      setPaintTypes(response.data.map(type => ({ ...type, id: normalizeId(type) })));
    } catch (error) {
      console.error('Error fetching paint types:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.brand || !formData.paintType || !formData.quantity) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      if (editingPaint) {
        const paintId = editingPaint.id || editingPaint._id;
        await axios.put(`/api/saved-paints/${paintId}`, formData);
      } else {
        await axios.post('/api/saved-paints', formData);
      }
      fetchSavedPaints();
      resetForm();
    } catch (error) {
      console.error('Error saving paint:', error);
      alert('Failed to save paint');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      brand: '',
      paintType: paintTypes.length > 0 ? paintTypes[0].name : '',
      quantity: '',
      color: '#ffffff'
    });
    setEditingPaint(null);
    setShowForm(false);
  };

  const handleEdit = (paint) => {
    setEditingPaint(paint);
    setFormData({
      name: paint.name,
      brand: paint.brand,
      paintType: paint.paintType,
      quantity: paint.quantity,
      color: paint.color || '#ffffff'
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this saved paint?')) {
      try {
        await axios.delete(`/api/saved-paints/${id}`);
        fetchSavedPaints();
      } catch (error) {
        console.error('Error deleting paint:', error);
      }
    }
  };

  const handleToggleFavorite = async (id) => {
    try {
      await axios.put(`/api/saved-paints/${id}/favorite`);
      fetchSavedPaints();
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  return (
    <div className="saved-paints-container">
      <div className="saved-paints-header">
        <h3>💾 Saved Paint Templates</h3>
        <button 
          className="btn btn-small"
          onClick={() => {
            setEditingPaint(null);
            setShowForm(!showForm);
          }}
        >
          {showForm ? 'Cancel' : '+ Add Template'}
        </button>
      </div>

      <div className="saved-paints-wrapper">
        <div className="left-panel">
          {showForm && (
            <form className="saved-paint-form" onSubmit={handleSubmit}>
              <div className="form-group-small">
                <label>Paint Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Sky Blue"
                  required
                />
              </div>

              <div className="form-group-small">
                <label>Brand</label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  placeholder="e.g., Dulux"
                  required
                />
              </div>

              <div className="form-group-small">
                <label>Paint Type</label>
                <select name="paintType" value={formData.paintType} onChange={handleInputChange} required>
                  <option value="">Select type</option>
                  {paintTypes.map(type => (
                    <option key={type.id} value={type.name}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group-small">
                <label>Quantity</label>
                <input
                  type="text"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  placeholder="e.g., 5L"
                  required
                />
              </div>

              <div className="form-group-small">
                <label>Color</label>
                <input
                  type="color"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                />
              </div>

              <button type="submit" className="btn btn-submit-small">
                {editingPaint ? 'Update' : 'Save Template'}
              </button>
            </form>
          )}

          <div className="saved-paints-list">
            {savedPaints.length === 0 ? (
              <p className="empty-message">No saved paint templates yet</p>
            ) : (
              savedPaints.map(paint => {
                const paintId = paint.id || paint._id;
                return (
                  <div 
                    key={paintId} 
                    className={`paint-item ${selectedPaint?.id === paintId || selectedPaint?._id === paintId ? 'selected' : ''}`}
                    onClick={() => setSelectedPaint(paint)}
                  >
                    <div className="paint-color-box" style={{ backgroundColor: paint.color }}></div>
                    <div className="paint-info">
                      <h4>{paint.name}</h4>
                      <p className="paint-details">{paint.brand} • {paint.paintType} • {paint.quantity}</p>
                    </div>
                    <div className="paint-actions">
                      <button 
                        className={`btn-favorite ${paint.isFavorite ? 'active' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleFavorite(paintId);
                        }}
                        title={paint.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        {paint.isFavorite ? '⭐' : '☆'}
                      </button>
                      <button 
                        className="btn-edit"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(paint);
                        }}
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button 
                        className="btn-delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(paintId);
                        }}
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="right-panel">
          {selectedPaint ? (
            <div className="paint-details">
              <h2>Paint Details & QR Code</h2>
              <div className="details-container">
                <div className="detail-row">
                  <span className="label">Name:</span>
                  <span className="value">{selectedPaint.name}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Brand:</span>
                  <span className="value">{selectedPaint.brand}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Paint Type:</span>
                  <span className="value">{selectedPaint.paintType}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Quantity:</span>
                  <span className="value">{selectedPaint.quantity}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Color:</span>
                  <span className="value">
                    <div style={{ display: 'inline-block', width: '24px', height: '24px', backgroundColor: selectedPaint.color, border: '1px solid #ccc', borderRadius: '4px' }}></div>
                  </span>
                </div>
              </div>

              <div id="qr-code-section" className="qr-section">
                <QRPaintDisplay paint={selectedPaint} />
              </div>
            </div>
          ) : (
            <div className="no-selection">
              <p>Select a paint template to view details and generate QR code</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function QRPaintDisplay({ paint }) {
  const handleDownload = (format) => {
    const qrElement = document.querySelector('#qr-paint-ref');
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
      link.download = `${paint.name}-${paint.brand}.${format}`;
      link.click();
    };

    image.src = url;
  };

  const handlePrint = () => {
    const qrElement = document.querySelector('#qr-paint-ref');
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
            <title>Print QR Code - ${paint.name}</title>
          </head>
          <body style="display: flex; flex-direction: column; align-items: center; padding: 20px;">
            <h2>${paint.name}</h2>
            <p><strong>Brand:</strong> ${paint.brand}</p>
            <p><strong>Type:</strong> ${paint.paintType}</p>
            <img src="${imgData}" />
            <p style="margin-top: 20px; text-align: center;">
              <strong>Scan this QR code to view paint template details</strong>
            </p>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    };

    image.src = url;
  };

  return (
    <div className="qr-display">
      <div id="qr-paint-ref" className="qr-code-container">
        <QRCode 
          value={`${window.location.origin}/paint/${paint.id}`}
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
      </div>
    </div>
  );
}

export default SavedPaints;
