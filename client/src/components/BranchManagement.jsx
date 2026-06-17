import React, { useState, useEffect } from 'react';
import './BranchManagement.css';

export default function BranchManagement() {
  const [branches, setBranches] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    branchName: '',
    branchCode: '',
    location: '',
    manager: '',
    contact: '',
    email: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const response = await fetch('/api/branches', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
      });
      const data = await response.json();
      setBranches(data);
    } catch (error) {
      console.error('Error fetching branches:', error);
      setMessage('Error loading branches');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `/api/branches/${editingId}` : '/api/branches';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to save branch');

      setMessage(editingId ? 'Branch updated successfully' : 'Branch created successfully');
      setFormData({
        branchName: '',
        branchCode: '',
        location: '',
        manager: '',
        contact: '',
        email: ''
      });
      setEditingId(null);
      setShowForm(false);
      fetchBranches();
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const handleEdit = (branch) => {
    setFormData(branch);
    setEditingId(branch._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this branch?')) {
      try {
        const response = await fetch(`/api/branches/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
        });
        if (!response.ok) throw new Error('Failed to delete branch');
        setMessage('Branch deleted successfully');
        fetchBranches();
      } catch (error) {
        setMessage(`Error: ${error.message}`);
      }
    }
  };

  return (
    <div className="branch-management">
      <h2>Branch Management</h2>

      {message && <div className="message">{message}</div>}

      <button 
        className="btn btn-primary"
        onClick={() => {
          setShowForm(!showForm);
          if (!showForm) {
            setFormData({
              branchName: '',
              branchCode: '',
              location: '',
              manager: '',
              contact: '',
              email: ''
            });
            setEditingId(null);
          }
        }}
      >
        {showForm ? 'Cancel' : '+ Add Branch'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="branch-form">
          <div className="form-row">
            <div className="form-group">
              <label>Branch Name *</label>
              <input
                type="text"
                name="branchName"
                value={formData.branchName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Branch Code *</label>
              <input
                type="text"
                name="branchCode"
                value={formData.branchCode}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Manager *</label>
              <input
                type="text"
                name="manager"
                value={formData.manager}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Contact *</label>
              <input
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-success">
            {editingId ? 'Update' : 'Create'} Branch
          </button>
        </form>
      )}

      <div className="branches-grid">
        {branches.map(branch => (
          <div key={branch._id} className="branch-card">
            <h3>{branch.branchName}</h3>
            <p><strong>Code:</strong> {branch.branchCode}</p>
            <p><strong>Location:</strong> {branch.location}</p>
            <p><strong>Manager:</strong> {branch.manager}</p>
            <p><strong>Contact:</strong> {branch.contact}</p>
            {branch.email && <p><strong>Email:</strong> {branch.email}</p>}
            <p className={`status ${branch.isActive ? 'active' : 'inactive'}`}>
              {branch.isActive ? 'Active' : 'Inactive'}
            </p>
            <div className="actions">
              <button className="btn btn-edit" onClick={() => handleEdit(branch)}>Edit</button>
              <button className="btn btn-delete" onClick={() => handleDelete(branch._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {branches.length === 0 && !showForm && (
        <p className="no-data">No branches found. Create one to get started!</p>
      )}
    </div>
  );
}
