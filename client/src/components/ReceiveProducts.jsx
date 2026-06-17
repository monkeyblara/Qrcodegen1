import React, { useState, useEffect } from 'react';
import './ReceiveProducts.css';

export default function ReceiveProducts() {
  const [products, setProducts] = useState([]);
  const [branches, setBranches] = useState([]);
  const [formData, setFormData] = useState({
    productId: '',
    branchId: '',
    quantityReceived: '',
    supplierName: '',
    receivedBy: '',
    notes: ''
  });
  const [message, setMessage] = useState('');
  const [receiving, setReceiving] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchBranches();
    fetchReceiving();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchBranches = async () => {
    try {
      const response = await fetch('/api/branches/active/list', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setBranches(data);
    } catch (error) {
      console.error('Error fetching branches:', error);
    }
  };

  const fetchReceiving = async () => {
    try {
      const response = await fetch('/api/receiving', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setReceiving(data);
    } catch (error) {
      console.error('Error fetching receiving:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.productId || !formData.branchId || !formData.quantityReceived || !formData.supplierName || !formData.receivedBy) {
      setMessage('Please fill all required fields');
      return;
    }

    try {
      const selectedProduct = products.find(p => p._id === formData.productId);
      
      const response = await fetch('/api/receiving', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...formData,
          quantityReceived: parseInt(formData.quantityReceived),
          serialNumber: selectedProduct.serialNumber,
          receiveDate: new Date()
        })
      });

      if (!response.ok) throw new Error('Failed to record receiving');

      setMessage('Product received successfully!');
      setFormData({
        productId: '',
        branchId: '',
        quantityReceived: '',
        supplierName: '',
        receivedBy: '',
        notes: ''
      });
      fetchReceiving();
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div className="receive-products">
      <h2>Receive Products</h2>

      {message && <div className="message">{message}</div>}

      <form onSubmit={handleSubmit} className="receive-form">
        <div className="form-row">
          <div className="form-group">
            <label>Product *</label>
            <select
              name="productId"
              value={formData.productId}
              onChange={handleInputChange}
              required
            >
              <option value="">Select a product</option>
              {products.map(p => (
                <option key={p._id} value={p._id}>
                  {p.productName} - {p.brand}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Branch *</label>
            <select
              name="branchId"
              value={formData.branchId}
              onChange={handleInputChange}
              required
            >
              <option value="">Select a branch</option>
              {branches.map(b => (
                <option key={b._id} value={b._id}>
                  {b.branchName} ({b.branchCode})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Quantity Received *</label>
            <input
              type="number"
              name="quantityReceived"
              value={formData.quantityReceived}
              onChange={handleInputChange}
              required
              min="1"
            />
          </div>

          <div className="form-group">
            <label>Supplier Name *</label>
            <input
              type="text"
              name="supplierName"
              value={formData.supplierName}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Received By *</label>
            <input
              type="text"
              name="receivedBy"
              value={formData.receivedBy}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="form-group full-width">
          <label>Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            rows="3"
          />
        </div>

        <button type="submit" className="btn btn-success">Record Receipt</button>
      </form>

      <div className="receiving-history">
        <h3>Recent Receiving History</h3>
        <table>
          <thead>
            <tr>
              <th>Receipt #</th>
              <th>Product</th>
              <th>Branch</th>
              <th>Quantity</th>
              <th>Supplier</th>
              <th>Received By</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {receiving.slice(0, 10).map(rec => (
              <tr key={rec._id}>
                <td>{rec.receiptNumber}</td>
                <td>{rec.productId?.productName}</td>
                <td>{rec.branchId?.branchName}</td>
                <td>{rec.quantityReceived}</td>
                <td>{rec.supplierName}</td>
                <td>{rec.receivedBy}</td>
                <td>{new Date(rec.receiveDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
