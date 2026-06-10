import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import axios from 'axios';
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
                <div className="qr-container">
                  <QRCode 
                    value={`${window.location.origin}/chemical/${chemical.id}`}
                    size={100} 
                  />
                </div>
              )}

              <div className="chemical-actions">
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
