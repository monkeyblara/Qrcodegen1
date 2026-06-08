import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PaintTypesManager.css';

function PaintTypesManager() {
  const [paintTypes, setPaintTypes] = useState([]);
  const [newType, setNewType] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPaintTypes();
  }, []);

  const normalizeId = (item) => item.id || item._id || (item._id ? item._id.toString() : undefined);

  const fetchPaintTypes = async () => {
    try {
      const response = await axios.get('/api/paint-types');
      setPaintTypes(response.data.map(type => ({ ...type, id: normalizeId(type) })));
      setError('');
    } catch (err) {
      console.error('Error fetching paint types:', err);
      setError('Failed to load paint types');
    }
  };

  const handleAddType = async (e) => {
    e.preventDefault();
    
    if (!newType.trim()) {
      setError('Paint type name cannot be empty');
      return;
    }

    setLoading(true);
    try {
      await axios.post('/api/paint-types', { name: newType });
      setNewType('');
      fetchPaintTypes();
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add paint type');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteType = async (id, name) => {
    if (window.confirm(`Delete paint type "${name}"?`)) {
      try {
        await axios.delete(`/api/paint-types/${id}`);
        fetchPaintTypes();
        setError('');
      } catch (err) {
        setError('Failed to delete paint type');
      }
    }
  };

  return (
    <div className="paint-types-manager">
      <h3>🎨 Paint Types Manager</h3>
      
      <form className="add-type-form" onSubmit={handleAddType}>
        <input
          type="text"
          value={newType}
          onChange={(e) => setNewType(e.target.value)}
          placeholder="Enter new paint type (e.g., Matte, Glossy)"
          disabled={loading}
        />
        <button type="submit" disabled={loading} className="btn-add-type">
          {loading ? 'Adding...' : '+ Add Type'}
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}

      <div className="types-list">
        {paintTypes.length === 0 ? (
          <p className="no-types">No paint types available</p>
        ) : (
          paintTypes.map(type => {
            const typeId = type.id || type._id;
            return (
              <div key={typeId} className="type-item">
                <span className="type-name">{type.name}</span>
                <button 
                  className="btn-remove-type"
                  onClick={() => handleDeleteType(typeId, type.name)}
                  title="Delete this paint type"
                >
                  ✕
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default PaintTypesManager;
