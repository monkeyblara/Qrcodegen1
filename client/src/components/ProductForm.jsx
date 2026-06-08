import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProductForm.css';

function ProductForm({ onSubmit, initialData }) {
  const [paintTypes, setPaintTypes] = useState([]);
  const [formData, setFormData] = useState({
    productName: '',
    brand: '',
    paintType: '',
    quantity: '',
    expiryDate: ''
  });

  useEffect(() => {
    fetchPaintTypes();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData({
        productName: initialData.productName || '',
        brand: initialData.brand || '',
        paintType: initialData.paintType || '',
        quantity: initialData.quantity || '',
        expiryDate: initialData.expiryDate || ''
      });
    }
  }, [initialData]);

  const fetchPaintTypes = async () => {
    try {
      const response = await axios.get('/api/paint-types');
      setPaintTypes(response.data);
      if (response.data.length > 0 && !formData.paintType) {
        setFormData(prev => ({
          ...prev,
          paintType: response.data[0].name
        }));
      }
    } catch (error) {
      console.error('Error fetching paint types:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.productName || !formData.brand || !formData.paintType || !formData.quantity || !formData.expiryDate) {
      alert('Please fill in all fields');
      return;
    }

    onSubmit(formData);
    
    setFormData({
      productName: '',
      brand: '',
      paintType: paintTypes.length > 0 ? paintTypes[0].name : '',
      quantity: '',
      expiryDate: ''
    });
  };

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <h3>{initialData ? 'Edit Product' : 'Add New Product'}</h3>
      
      <div className="form-group">
        <label htmlFor="productName">Product Name *</label>
        <input
          type="text"
          id="productName"
          name="productName"
          value={formData.productName}
          onChange={handleChange}
          placeholder="e.g., Premium Wall Paint"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="brand">Brand *</label>
        <input
          type="text"
          id="brand"
          name="brand"
          value={formData.brand}
          onChange={handleChange}
          placeholder="e.g., Dulux, Berger"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="paintType">Paint Type *</label>
        <select
          id="paintType"
          name="paintType"
          value={formData.paintType}
          onChange={handleChange}
          required
        >
          <option value="">Select a paint type</option>
          {paintTypes.map(type => (
            <option key={type.id || type._id} value={type.name}>
              {type.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="quantity">Quantity *</label>
        <input
          type="text"
          id="quantity"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          placeholder="e.g., 5L, 20 Liters"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="expiryDate">Expiry Date *</label>
        <input
          type="date"
          id="expiryDate"
          name="expiryDate"
          value={formData.expiryDate}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit" className="btn btn-submit">
        {initialData ? 'Update Product' : 'Add Product'}
      </button>
    </form>
  );
}

export default ProductForm;
