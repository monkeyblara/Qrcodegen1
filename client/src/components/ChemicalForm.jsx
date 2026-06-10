import React, { useState } from 'react';
import './ChemicalForm.css';

function ChemicalForm({ onSubmit, initialData = null, onCancel }) {
  const [formData, setFormData] = useState(
    initialData || {
      chemicalName: '',
      manufacturer: '',
      chemicalType: '',
      quantity: '',
      unit: 'L',
      hazardLevel: 'Medium',
      storageLocation: '',
      expiryDate: ''
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.chemicalName || !formData.manufacturer || !formData.chemicalType || 
        !formData.quantity || !formData.storageLocation || !formData.expiryDate) {
      alert('Please fill all required fields');
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="chemical-form">
      <h3>{initialData ? 'Edit Chemical' : 'Add New Chemical'}</h3>
      
      <div className="form-group">
        <label>Chemical Name *</label>
        <input
          type="text"
          name="chemicalName"
          value={formData.chemicalName}
          onChange={handleChange}
          placeholder="e.g., Sodium Hydroxide"
          required
        />
      </div>

      <div className="form-group">
        <label>Manufacturer *</label>
        <input
          type="text"
          name="manufacturer"
          value={formData.manufacturer}
          onChange={handleChange}
          placeholder="e.g., Sigma-Aldrich"
          required
        />
      </div>

      <div className="form-group">
        <label>Chemical Type *</label>
        <select
          name="chemicalType"
          value={formData.chemicalType}
          onChange={handleChange}
          required
        >
          <option value="">Select Type</option>
          <option value="Acid">Acid</option>
          <option value="Base">Base</option>
          <option value="Salt">Salt</option>
          <option value="Organic">Organic</option>
          <option value="Solvent">Solvent</option>
          <option value="Catalyst">Catalyst</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Quantity *</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="e.g., 500"
            required
          />
        </div>

        <div className="form-group">
          <label>Unit *</label>
          <select
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            required
          >
            <option value="mL">mL</option>
            <option value="L">L</option>
            <option value="mg">mg</option>
            <option value="g">g</option>
            <option value="kg">kg</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Hazard Level *</label>
        <select
          name="hazardLevel"
          value={formData.hazardLevel}
          onChange={handleChange}
          required
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      <div className="form-group">
        <label>Storage Location *</label>
        <input
          type="text"
          name="storageLocation"
          value={formData.storageLocation}
          onChange={handleChange}
          placeholder="e.g., Cabinet A, Shelf 2"
          required
        />
      </div>

      <div className="form-group">
        <label>Expiry Date *</label>
        <input
          type="date"
          name="expiryDate"
          value={formData.expiryDate}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-buttons">
        <button type="submit" className="btn btn-primary">
          {initialData ? 'Update Chemical' : 'Add Chemical'}
        </button>
        {onCancel && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default ChemicalForm;
