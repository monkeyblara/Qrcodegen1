import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SavedPaints.css';

function SavedPaints() {
  const [savedPaints, setSavedPaints] = useState([]);
  const [paintTypes, setPaintTypes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPaint, setEditingPaint] = useState(null);
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
              <div key={paintId} className="paint-item">
                <div className="paint-color-box" style={{ backgroundColor: paint.color }}></div>
                <div className="paint-info">
                  <h4>{paint.name}</h4>
                  <p className="paint-details">{paint.brand} • {paint.paintType} • {paint.quantity}</p>
                </div>
                <div className="paint-actions">
                  <button 
                    className={`btn-favorite ${paint.isFavorite ? 'active' : ''}`}
                    onClick={() => handleToggleFavorite(paintId)}
                    title={paint.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                  >
                  {paint.isFavorite ? '⭐' : '☆'}
                </button>
                <button 
                  className="btn-edit"
                  onClick={() => handleEdit(paint)}
                  title="Edit"
                >
                  ✏️
                </button>
                <button 
                  className="btn-delete"
                  onClick={() => handleDelete(paintId)}
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default SavedPaints;
