import React, { useState, useEffect } from 'react';
import './TransferHistory.css';

export default function TransferHistory() {
  const [transfers, setTransfers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchBranches();
    fetchTransfers();
  }, []);

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

  const fetchTransfers = async (branchId = '', status = '') => {
    try {
      let url = '/api/transfers';
      if (branchId) {
        url = `/api/transfers/branch/${branchId}`;
      }

      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      
      let filtered = data;
      if (status) {
        filtered = data.filter(t => t.status === status);
      }
      
      setTransfers(filtered);
    } catch (error) {
      console.error('Error fetching transfers:', error);
    }
  };

  const handleBranchChange = (e) => {
    const branch = e.target.value;
    setSelectedBranch(branch);
    fetchTransfers(branch, statusFilter);
  };

  const handleStatusChange = (e) => {
    const status = e.target.value;
    setStatusFilter(status);
    fetchTransfers(selectedBranch, status);
  };

  const updateStatus = async (transferId, newStatus) => {
    try {
      const response = await fetch(`/api/transfers/${transferId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error('Failed to update status');

      fetchTransfers(selectedBranch, statusFilter);
    } catch (error) {
      alert(`Error: ${error.message}`);
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

  const getStatusActions = (transfer) => {
    const actions = [];
    if (transfer.status === 'pending') {
      actions.push('in-transit', 'cancelled');
    } else if (transfer.status === 'in-transit') {
      actions.push('received', 'cancelled');
    }
    return actions;
  };

  return (
    <div className="transfer-history">
      <h2>Transfer History</h2>

      <div className="filters">
        <div className="filter-group">
          <label>Branch:</label>
          <select value={selectedBranch} onChange={handleBranchChange}>
            <option value="">All Branches</option>
            {branches.map(b => (
              <option key={b._id} value={b._id}>
                {b.branchName} ({b.branchCode})
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Status:</label>
          <select value={statusFilter} onChange={handleStatusChange}>
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in-transit">In Transit</option>
            <option value="received">Received</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="summary">
        <div className="summary-item">
          <span className="label">Total Transfers:</span>
          <span className="value">{transfers.length}</span>
        </div>
        <div className="summary-item">
          <span className="label">Total Quantity:</span>
          <span className="value">{transfers.reduce((sum, t) => sum + t.quantityTransferred, 0)}</span>
        </div>
      </div>

      <div className="transfers-table-container">
        {transfers.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Transfer #</th>
                <th>Product</th>
                <th>From Branch</th>
                <th>To Branch</th>
                <th>Quantity</th>
                <th>Transferred By</th>
                <th>Transfer Date</th>
                <th>Received Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transfers.map(transfer => (
                <tr key={transfer._id}>
                  <td className="transfer-id">{transfer.transferNumber}</td>
                  <td>
                    <strong>{transfer.productId?.productName}</strong>
                    <br />
                    <small>{transfer.productId?.brand}</small>
                  </td>
                  <td>{transfer.fromBranchId?.branchName}</td>
                  <td>{transfer.toBranchId?.branchName}</td>
                  <td className="quantity">{transfer.quantityTransferred}</td>
                  <td>{transfer.transferredBy}</td>
                  <td>{new Date(transfer.transferDate).toLocaleDateString()}</td>
                  <td>
                    {transfer.receivedDate
                      ? new Date(transfer.receivedDate).toLocaleDateString()
                      : '-'
                    }
                  </td>
                  <td>
                    <span className="status-badge" style={{ background: getStatusColor(transfer.status) }}>
                      {transfer.status}
                    </span>
                  </td>
                  <td className="actions">
                    {getStatusActions(transfer).length > 0 ? (
                      <select
                        className="action-select"
                        onChange={(e) => {
                          if (e.target.value) {
                            updateStatus(transfer._id, e.target.value);
                            e.target.value = '';
                          }
                        }}
                        defaultValue=""
                      >
                        <option value="">Update</option>
                        {getStatusActions(transfer).map(action => (
                          <option key={action} value={action}>
                            {action.charAt(0).toUpperCase() + action.slice(1)}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="no-actions">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-data">No transfer records found</p>
        )}
      </div>
    </div>
  );
}
