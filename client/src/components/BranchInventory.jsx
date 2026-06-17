import React, { useState, useEffect } from 'react';
import './BranchInventory.css';

export default function BranchInventory() {
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBranches();
  }, []);

  useEffect(() => {
    if (selectedBranch) {
      fetchInventory();
    }
  }, [selectedBranch]);

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

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/inventory/branch/${selectedBranch}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setInventory(data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStockStatus = (quantity) => {
    if (quantity <= 5) return 'critical';
    if (quantity <= 10) return 'low';
    return 'good';
  };

  const getTotalValue = () => {
    return inventory.reduce((sum, item) => sum + (item.currentQuantity || 0), 0);
  };

  const selectedBranchObj = branches.find(b => b._id === selectedBranch);

  return (
    <div className="branch-inventory">
      <h2>Branch Inventory</h2>

      <div className="branch-selector">
        <label>Select Branch:</label>
        <select
          value={selectedBranch}
          onChange={(e) => setSelectedBranch(e.target.value)}
        >
          <option value="">-- Select Branch --</option>
          {branches.map(b => (
            <option key={b._id} value={b._id}>
              {b.branchName} ({b.branchCode})
            </option>
          ))}
        </select>
      </div>

      {selectedBranch && selectedBranchObj && (
        <div className="branch-info">
          <h3>{selectedBranchObj.branchName}</h3>
          <p><strong>Location:</strong> {selectedBranchObj.location}</p>
          <p><strong>Manager:</strong> {selectedBranchObj.manager}</p>
        </div>
      )}

      {selectedBranch && (
        <>
          {loading ? (
            <p className="loading">Loading inventory...</p>
          ) : (
            <>
              <div className="inventory-summary">
                <div className="summary-card">
                  <p className="summary-label">Total Items</p>
                  <p className="summary-value">{inventory.length}</p>
                </div>
                <div className="summary-card">
                  <p className="summary-label">Total Units</p>
                  <p className="summary-value">{getTotalValue()}</p>
                </div>
              </div>

              {inventory.length > 0 ? (
                <div className="inventory-table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Serial Number</th>
                        <th>Received</th>
                        <th>Transferred</th>
                        <th>Sold</th>
                        <th>Current Stock</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inventory.map(item => (
                        <tr key={item._id}>
                          <td className="product-name">
                            <strong>{item.productId?.productName}</strong>
                            <br />
                            <small>{item.productId?.brand}</small>
                          </td>
                          <td className="serial">{item.serialNumber}</td>
                          <td className="received">{item.quantityReceived}</td>
                          <td className="transferred">{item.quantityTransferred}</td>
                          <td className="sold">{item.quantitySold}</td>
                          <td className="stock">
                            <strong>{item.currentQuantity}</strong>
                          </td>
                          <td>
                            <span className={`status ${getStockStatus(item.currentQuantity)}`}>
                              {getStockStatus(item.currentQuantity).toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="no-inventory">No inventory records found for this branch</p>
              )}
            </>
          )}
        </>
      )}

      {!selectedBranch && (
        <p className="select-branch-message">Please select a branch to view inventory</p>
      )}
    </div>
  );
}
