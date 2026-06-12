import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import axios from 'axios';
import { getAppOrigin } from '../utils/getAppOrigin';
import ChemicalForm from './ChemicalForm';
import './ChemicalsList.css';

function ChemicalsList() {
  const [chemicals, setChemicals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingChemical, setEditingChemical] = useState(null);
  const [selectedChemical, setSelectedChemical] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');

  useEffect(() => {
    fetchChemicals();
  }, []);

  const fetchChemicals = async () => {
    try {
      const response = await axios.get('/api/chemicals');
      const normalized = response.data.map(c => ({ ...c, id: c._id }));
      setChemicals(normalized);
    } catch (error) {
      console.error('Error fetching chemicals:', error);
    }
  };

  const handleAddChemical = async (formData) => {
    try {
      await axios.post('/api/chemicals', formData);
      fetchChemicals();
      setShowForm(false);
    } catch (error) {
      console.error('Error adding chemical:', error);
      alert('Error adding chemical');
    }
  };

  const handleUpdateChemical = async (id, formData) => {
    try {
      await axios.put(`/api/chemicals/${id}`, formData);
      fetchChemicals();
      setEditingChemical(null);
      setShowForm(false);
    } catch (error) {
      console.error('Error updating chemical:', error);
      alert('Error updating chemical');
    }
  };

  const handleDeleteChemical = async (id) => {
    if (window.confirm('Are you sure you want to delete this chemical?')) {
      try {
        await axios.delete(`/api/chemicals/${id}`);
        fetchChemicals();
      } catch (error) {
        console.error('Error deleting chemical:', error);
        alert('Error deleting chemical');
      }
    }
  };

  const handleGenerateQR = async (id) => {
    try {
      await axios.post(`/api/chemicals/${id}/qr`);
      fetchChemicals();
      alert('QR Code generated successfully! Scan it to view chemical details.');
    } catch (error) {
      console.error('Error generating QR code:', error);
      alert('Error generating QR code');
    }
  };

  const handleToggleFavorite = async (id) => {
    try {
      await axios.put(`/api/chemicals/${id}/favorite`);
      fetchChemicals();
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handlePrint = (chemical) => {
    const itemId = chemical.id;
    const qrElement = document.querySelector(`#qr-code-${itemId} svg`);
    if (!qrElement) {
      alert('Please generate a QR code first.');
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

  const filteredChemicals = chemicals.filter(c => {
    const matchesSearch = c.chemicalName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         c.manufacturer?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = !filterType || c.chemicalType === filterType;
    return matchesSearch && matchesFilter;
  });

  const chemicalTypes = [...new Set(chemicals.map(c => c.chemicalType))];

  return (
    <div className="chemicals-container">
      <div className="chemicals-header">
        <h2>🧪 Chemicals Management</h2>
        <button 
          className="btn btn-primary"
          onClick={() => {
            setEditingChemical(null);
            setShowForm(!showForm);
          }}
        >
          {showForm ? 'Cancel' : '+ Add New Chemical'}
        </button>
      </div>

      {showForm && (
        <ChemicalForm
          initialData={editingChemical}
          onSubmit={(data) => 
            editingChemical 
              ? handleUpdateChemical(editingChemical.id, data)
              : handleAddChemical(data)
          }
          onCancel={() => {
            setShowForm(false);
            setEditingChemical(null);
          }}
        />
      )}

      <div className="chemicals-controls">
        <input
          type="text"
          placeholder="Search by name or manufacturer..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="filter-select"
        >
          <option value="">All Types</option>
          {chemicalTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {filteredChemicals.length === 0 ? (
        <p className="no-chemicals">No chemicals found. Add one to get started!</p>
      ) : (
        <div className="chemicals-grid">
          {filteredChemicals.map(chemical => (
            <div key={chemical.id} className={`chemical-card ${chemical.isFavorite ? 'favorite' : ''}`}>
              <div className="chemical-card-header">
                <h3>{chemical.chemicalName}</h3>
                <button
                  className="favorite-btn"
                  onClick={() => handleToggleFavorite(chemical.id)}
                  title={chemical.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                  {chemical.isFavorite ? '⭐' : '☆'}
                </button>
              </div>

              <div className="chemical-info">
                <p><strong>Manufacturer:</strong> {chemical.manufacturer}</p>
                <p><strong>Type:</strong> <span className={`type-badge ${chemical.chemicalType}`}>{chemical.chemicalType}</span></p>
                <p><strong>Quantity:</strong> {chemical.quantity} {chemical.unit}</p>
                <p><strong>Hazard Level:</strong> <span className={`hazard-${chemical.hazardLevel}`}>{chemical.hazardLevel}</span></p>
                <p><strong>Location:</strong> {chemical.storageLocation}</p>
                <p><strong>Expiry:</strong> {chemical.expiryDate}</p>
                <p><strong>Serial:</strong> <span className="serial">{chemical.serialNumber}</span></p>
              </div>

              {chemical.qrCode && (
                <div id={`qr-code-${chemical.id}`} className="qr-container">
                  <QRCode 
                    value={`${getAppOrigin()}/chemical/${chemical.id}`}
                    size={100} 
                  />
                </div>
              )}

              <div className="chemical-actions">
                <button
                  className="btn-sm btn-print"
                  onClick={() => handlePrint(chemical)}
                  title={chemical.qrCode ? 'Print QR Code' : 'Generate QR code first'}
                >
                  🖨️ Print
                </button>
                <button
                  className="btn btn-sm btn-qr"
                  onClick={() => handleGenerateQR(chemical.id)}
                >
                  📱 Generate QR
                </button>
                <button
                  className="btn btn-sm btn-edit"
                  onClick={() => {
                    setEditingChemical(chemical);
                    setShowForm(true);
                  }}
                >
                  ✏️ Edit
                </button>
                <button
                  className="btn btn-sm btn-delete"
                  onClick={() => handleDeleteChemical(chemical.id)}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ChemicalsList;
