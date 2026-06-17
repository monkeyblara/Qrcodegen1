import React, { useState, useEffect } from 'react';
import './SalesHistory.css';

export default function SalesHistory() {
  const [sales, setSales] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [statistics, setStatistics] = useState(null);

  useEffect(() => {
    fetchBranches();
    fetchSales();
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

  const fetchSales = async (branchId = '', start = dateRange.startDate, end = dateRange.endDate) => {
    try {
      let url = '/api/sales/date-range?';
      if (start && end) {
        url += `startDate=${start}T00:00:00&endDate=${end}T23:59:59`;
      }
      if (branchId) {
        url += (start && end ? '&' : '') + `branchId=${branchId}`;
      }

      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setSales(data);

      // Fetch statistics
      const statsUrl = `/api/sales/stats/summary?${url.split('?')[1]}`;
      const statsResponse = await fetch(statsUrl, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const statsData = await statsResponse.json();
      setStatistics(statsData);
    } catch (error) {
      console.error('Error fetching sales:', error);
    }
  };

  const handleBranchChange = (e) => {
    const branch = e.target.value;
    setSelectedBranch(branch);
    fetchSales(branch, dateRange.startDate, dateRange.endDate);
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    const newRange = { ...dateRange, [name]: value };
    setDateRange(newRange);
    fetchSales(selectedBranch, newRange.startDate, newRange.endDate);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  return (
    <div className="sales-history">
      <h2>Sales History & Analytics</h2>

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
          <label>From:</label>
          <input
            type="date"
            name="startDate"
            value={dateRange.startDate}
            onChange={handleDateChange}
          />
        </div>

        <div className="filter-group">
          <label>To:</label>
          <input
            type="date"
            name="endDate"
            value={dateRange.endDate}
            onChange={handleDateChange}
          />
        </div>
      </div>

      {statistics && (
        <div className="statistics">
          <div className="stat-card">
            <h4>Total Sales</h4>
            <p className="stat-value">{statistics.totalSales}</p>
          </div>
          <div className="stat-card">
            <h4>Total Revenue</h4>
            <p className="stat-value">{formatCurrency(statistics.totalRevenue)}</p>
          </div>
          <div className="stat-card">
            <h4>Total Quantity</h4>
            <p className="stat-value">{statistics.totalQuantity} units</p>
          </div>
          <div className="stat-card">
            <h4>Avg Sale Value</h4>
            <p className="stat-value">
              {formatCurrency(statistics.totalRevenue / (statistics.totalSales || 1))}
            </p>
          </div>
        </div>
      )}

      {statistics && statistics.byPaymentMethod && (
        <div className="payment-methods">
          <h3>Sales by Payment Method</h3>
          <div className="methods-grid">
            {Object.entries(statistics.byPaymentMethod).map(([method, amount]) => (
              <div key={method} className="method-card">
                <h5>{method.charAt(0).toUpperCase() + method.slice(1)}</h5>
                <p>{formatCurrency(amount)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="sales-table-container">
        <h3>Sales Records</h3>
        {sales.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Product</th>
                <th>Branch</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total Amount</th>
                <th>Customer</th>
                <th>Seller</th>
                <th>Payment</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {sales.map(sale => (
                <tr key={sale._id}>
                  <td className="invoice-id">{sale.invoiceNumber}</td>
                  <td>{sale.productId?.productName}</td>
                  <td>{sale.branchId?.branchName}</td>
                  <td className="quantity">{sale.quantitySold}</td>
                  <td className="price">{sale.salePrice ? formatCurrency(sale.salePrice) : '-'}</td>
                  <td className="amount">{sale.totalAmount ? formatCurrency(sale.totalAmount) : '-'}</td>
                  <td>{sale.customerName || '-'}</td>
                  <td>{sale.soldBy}</td>
                  <td>
                    <span className="payment-badge">{sale.paymentMethod}</span>
                  </td>
                  <td>{new Date(sale.saleDate).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-data">No sales records found for the selected period</p>
        )}
      </div>
    </div>
  );
}
