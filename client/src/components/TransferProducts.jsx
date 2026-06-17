import React, { useState, useEffect } from 'react';
import './TransferProducts.css';

export default function TransferProducts() {
  const [products, setProducts] = useState([]);
  const [branches, setBranches] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [formData, setFormData] = useState({
    productId: '',
    fromBranchId: '',
    toBranchId: '',
    quantityTransferred: '',
    transferredBy: '',
    notes: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchBranches();
    fetchTransfers();
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

  const fetchTransfers = async () => {
    try {
      const response = await fetch('/api/transfers', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setTransfers(data);
    } catch (error) {
      console.error('Error fetching transfers:', error);
    }
  };

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Fetch inventory when product and from branch are selected
    if (name === 'productId' || name === 'fromBranchId') {
      const updatedForm = name === 'productId' 
        ? { ...formData, productId: value }
        : { ...formData, fromBranchId: value };

      if (updatedForm.productId && updatedForm.fromBranchId) {
        await fetchInventory(updatedForm.fromBranchId, updatedForm.productId);
      }
    }
  };

  const fetchInventory = async (branchId, productId) => {
    try {
      const response = await fetch(`/api/inventory/branch/${branchId}/product/${productId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setInventory(data);
      } else {
        setInventory(null);
      }
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.productId || !formData.fromBranchId || !formData.toBranchId || 
        !formData.quantityTransferred || !formData.transferredBy) {
      setMessage('Please fill all required fields');
      return;
    }

    if (formData.fromBranchId === formData.toBranchId) {
      setMessage('Source and destination branches must be different');
      return;
    }

    try {
      const selectedProduct = products.find(p => p._id === formData.productId);
      
      const response = await fetch('/api/transfers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...formData,
          quantityTransferred: parseInt(formData.quantityTransferred),
          serialNumber: selectedProduct.serialNumber,
          transferDate: new Date()
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      setMessage('Product transfer initiated successfully!');
      setFormData({
        productId: '',
        fromBranchId: '',
        toBranchId: '',
        quantityTransferred: '',
        transferredBy: '',
        notes: ''
      });
      setInventory(null);
      fetchTransfers();
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': '#ffc107',
      'in-transit': '#17a2b8',
      'received': '#28a745',
      'cancelled': '#dc3545'
    };
    return colors[status] || '#999';
  };

  return (
    <div className="transfer-products">
      <h2>Transfer Products Between Branches</h2>

      {message && <div className="message">{message}</div>}

      <form onSubmit={handleSubmit} className="transfer-form">
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
            <label>From Branch *</label>
            <select
              name="fromBranchId"
              value={formData.fromBranchId}
              onChange={handleInputChange}
              required
            >
              <option value="">Select source branch</option>
              {branches.map(b => (
                <option key={b._id} value={b._id}>
                  {b.branchName} ({b.branchCode})
                </option>
              ))}
            </select>
          </div>
        </div>

        {inventory && (
          <div className="inventory-info">
            <p><strong>Current Inventory:</strong> {inventory.currentQuantity} units</p>
          </div>
        )}

        <div className="form-row">
          <div className="form-group">
            <label>To Branch *</label>
            <select
              name="toBranchId"
              value={formData.toBranchId}
              onChange={handleInputChange}
              required
            >
              <option value="">Select destination branch</option>
              {branches.filter(b => b._id !== formData.fromBranchId).map(b => (
                <option key={b._id} value={b._id}>
                  {b.branchName} ({b.branchCode})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Quantity to Transfer *</label>
            <input
              type="number"
              name="quantityTransferred"
              value={formData.quantityTransferred}
              onChange={handleInputChange}
              required
              min="1"
              max={inventory?.currentQuantity || 999999}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Transferred By *</label>
            <input
              type="text"
              name="transferredBy"
              value={formData.transferredBy}
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

        <button type="submit" className="btn btn-success">Create Transfer</button>
      </form>

      <div className="transfers-history">
        <h3>Recent Transfers</h3>
        <table>
          <thead>
            <tr>
              <th>Transfer #</th>
              <th>Product</th>
              <th>From Branch</th>
              <th>To Branch</th>
              <th>Quantity</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {transfers.slice(0, 10).map(trans => (
              <tr key={trans._id}>
                <td>{trans.transferNumber}</td>
                <td>{trans.productId?.productName}</td>
                <td>{trans.fromBranchId?.branchName}</td>
                <td>{trans.toBranchId?.branchName}</td>
                <td>{trans.quantityTransferred}</td>
                <td>
                  <span className="status-badge" style={{ background: getStatusColor(trans.status) }}>
                    {trans.status}
                  </span>
                </td>
                <td>{new Date(trans.transferDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
