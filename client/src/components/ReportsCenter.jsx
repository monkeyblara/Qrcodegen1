import React, { useState, useEffect } from 'react';
import './ReportsCenter.css';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const initialDates = () => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 30);
  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0]
  };
};

const getAuthHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('authToken')}`
});

export default function ReportsCenter() {
  const [reportTab, setReportTab] = useState('sales');
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [dateRange, setDateRange] = useState(initialDates());
  const [salesData, setSalesData] = useState([]);
  const [transferData, setTransferData] = useState([]);
  const [receivingData, setReceivingData] = useState([]);
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchBranches();
  }, []);

  useEffect(() => {
    fetchCurrentReport();
  }, [reportTab, selectedBranch, dateRange]);

  const fetchBranches = async () => {
    try {
      const response = await fetch('/api/branches/active/list', {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      setBranches(data);
    } catch (error) {
      console.error('Error fetching branches:', error);
    }
  };

  const fetchCurrentReport = async () => {
    switch (reportTab) {
      case 'sales':
        await fetchSales();
        break;
      case 'transfers':
        await fetchTransfers();
        break;
      case 'receiving':
        await fetchReceiving();
        break;
      case 'inventory':
        await fetchInventory();
        break;
      default:
        break;
    }
  };

  const fetchSales = async () => {
    setLoading(true);
    try {
      let url = `/api/sales/date-range?startDate=${dateRange.startDate}T00:00:00&endDate=${dateRange.endDate}T23:59:59`;
      if (selectedBranch) {
        url += `&branchId=${selectedBranch}`;
      }
      const response = await fetch(url, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      setSalesData(data);
    } catch (error) {
      console.error('Error fetching sales report:', error);
      setMessage('Unable to load sales report.');
    } finally {
      setLoading(false);
    }
  };

  const fetchTransfers = async () => {
    setLoading(true);
    try {
      const url = selectedBranch ? `/api/transfers/branch/${selectedBranch}` : '/api/transfers';
      const response = await fetch(url, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      setTransferData(data);
    } catch (error) {
      console.error('Error fetching transfer report:', error);
      setMessage('Unable to load transfer report.');
    } finally {
      setLoading(false);
    }
  };

  const fetchReceiving = async () => {
    setLoading(true);
    try {
      const url = selectedBranch ? `/api/receiving/branch/${selectedBranch}` : '/api/receiving';
      const response = await fetch(url, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      setReceivingData(data);
    } catch (error) {
      console.error('Error fetching receiving report:', error);
      setMessage('Unable to load receiving report.');
    } finally {
      setLoading(false);
    }
  };

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const url = selectedBranch ? `/api/inventory/branch/${selectedBranch}` : '/api/inventory';
      const response = await fetch(url, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      setInventoryData(data);
    } catch (error) {
      console.error('Error fetching inventory report:', error);
      setMessage('Unable to load inventory report.');
    } finally {
      setLoading(false);
    }
  };

  const updateDateRange = (e) => {
    const { name, value } = e.target;
    setDateRange((prev) => ({ ...prev, [name]: value }));
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value || 0);
  };

  const exportToExcel = () => {
    let rows = [];
    let sheetName = 'Report';

    if (reportTab === 'sales') {
      rows = salesData.map((item) => ({
        'Invoice #': item.invoiceNumber,
        'Product': item.productId?.productName || '-',
        'Brand': item.productId?.brand || '-',
        'Branch': item.branchId?.branchName || '-',
        'Quantity': item.quantitySold,
        'Unit Price': item.salePrice || 0,
        'Total Amount': item.totalAmount || 0,
        'Customer': item.customerName || '-',
        'Seller': item.soldBy || '-',
        'Payment Method': item.paymentMethod || '-',
        'Date': item.saleDate ? new Date(item.saleDate).toLocaleString() : '-'
      }));
      sheetName = 'Sales';
    } else if (reportTab === 'transfers') {
      rows = transferData.map((item) => ({
        'Transfer #': item.transferNumber,
        'Product': item.productId?.productName || '-',
        'Brand': item.productId?.brand || '-',
        'From Branch': item.fromBranchId?.branchName || '-',
        'To Branch': item.toBranchId?.branchName || '-',
        'Quantity': item.quantityTransferred,
        'Status': item.status,
        'Transferred By': item.transferredBy || '-',
        'Transfer Date': item.transferDate ? new Date(item.transferDate).toLocaleString() : '-',
        'Received Date': item.receivedDate ? new Date(item.receivedDate).toLocaleString() : '-'
      }));
      sheetName = 'Transfers';
    } else if (reportTab === 'receiving') {
      rows = receivingData.map((item) => ({
        'Receipt #': item.receiptNumber,
        'Product': item.productId?.productName || '-',
        'Brand': item.productId?.brand || '-',
        'Branch': item.branchId?.branchName || '-',
        'Quantity Received': item.quantityReceived,
        'Supplier': item.supplierName || '-',
        'Received By': item.receivedBy || '-',
        'Date': item.receiveDate ? new Date(item.receiveDate).toLocaleString() : '-'
      }));
      sheetName = 'Receiving';
    } else if (reportTab === 'inventory') {
      rows = inventoryData.map((item) => ({
        'Product': item.productId?.productName || '-',
        'Brand': item.productId?.brand || '-',
        'Branch': item.branchId?.branchName || '-',
        'Serial Number': item.serialNumber || '-',
        'Received': item.quantityReceived,
        'Transferred': item.quantityTransferred,
        'Sold': item.quantitySold,
        'Current Quantity': item.currentQuantity,
        'Last Restock': item.lastRestockDate ? new Date(item.lastRestockDate).toLocaleString() : '-'
      }));
      sheetName = 'Inventory';
    }

    if (!rows.length) {
      setMessage('No report data available to export.');
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    const workbookBinary = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([workbookBinary], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${sheetName}-report-${new Date().toISOString().split('T')[0]}.xlsx`;
    link.click();
    URL.revokeObjectURL(url);
    setMessage('Excel report downloaded successfully.');
  };

  const exportToPdf = async () => {
    const element = document.getElementById('report-export-area');
    if (!element) {
      setMessage('Unable to find report content for PDF export.');
      return;
    }

    try {
      const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      let position = 0;
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);

      const pageHeight = pdf.internal.pageSize.getHeight();
      let remainingHeight = pdfHeight - pageHeight;
      while (remainingHeight > 0) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        remainingHeight -= pageHeight;
      }

      pdf.save(`${reportTab}-report-${new Date().toISOString().split('T')[0]}.pdf`);
      setMessage('PDF report downloaded successfully.');
    } catch (error) {
      console.error('PDF export error:', error);
      setMessage('Failed to export PDF report.');
    }
  };

  const renderSummary = () => {
    if (reportTab === 'sales') {
      const totalAmount = salesData.reduce((sum, item) => sum + (item.totalAmount || 0), 0);
      const totalQuantity = salesData.reduce((sum, item) => sum + (item.quantitySold || 0), 0);
      return (
        <div className="reports-summary-grid">
          <div className="summary-card"><span>Total Sales</span><strong>{salesData.length}</strong></div>
          <div className="summary-card"><span>Total Revenue</span><strong>{formatCurrency(totalAmount)}</strong></div>
          <div className="summary-card"><span>Total Units Sold</span><strong>{totalQuantity}</strong></div>
          <div className="summary-card"><span>Average Sale</span><strong>{formatCurrency(totalAmount / (salesData.length || 1))}</strong></div>
        </div>
      );
    }

    if (reportTab === 'transfers') {
      const totalQuantity = transferData.reduce((sum, item) => sum + (item.quantityTransferred || 0), 0);
      const statusCounts = transferData.reduce((acc, item) => {
        acc[item.status] = (acc[item.status] || 0) + 1;
        return acc;
      }, {});
      return (
        <div className="reports-summary-grid">
          <div className="summary-card"><span>Total Transfers</span><strong>{transferData.length}</strong></div>
          <div className="summary-card"><span>Total Units Transferred</span><strong>{totalQuantity}</strong></div>
          <div className="summary-card"><span>Pending</span><strong>{statusCounts.pending || 0}</strong></div>
          <div className="summary-card"><span>Received</span><strong>{statusCounts.received || 0}</strong></div>
        </div>
      );
    }

    if (reportTab === 'receiving') {
      const totalQuantity = receivingData.reduce((sum, item) => sum + (item.quantityReceived || 0), 0);
      return (
        <div className="reports-summary-grid">
          <div className="summary-card"><span>Total Receipts</span><strong>{receivingData.length}</strong></div>
          <div className="summary-card"><span>Total Units Received</span><strong>{totalQuantity}</strong></div>
          <div className="summary-card"><span>Active Branches</span><strong>{branches.length}</strong></div>
          <div className="summary-card"><span>Date Range</span><strong>{dateRange.startDate} → {dateRange.endDate}</strong></div>
        </div>
      );
    }

    if (reportTab === 'inventory') {
      const totalStock = inventoryData.reduce((sum, item) => sum + (item.currentQuantity || 0), 0);
      const lowStockCount = inventoryData.filter(item => item.currentQuantity <= 10).length;
      return (
        <div className="reports-summary-grid">
          <div className="summary-card"><span>Total Inventory Records</span><strong>{inventoryData.length}</strong></div>
          <div className="summary-card"><span>Total Current Stock</span><strong>{totalStock}</strong></div>
          <div className="summary-card"><span>Low Stock Items</span><strong>{lowStockCount}</strong></div>
          <div className="summary-card"><span>Selected Branch</span><strong>{selectedBranch ? branches.find(b => b._id === selectedBranch)?.branchName || '-' : 'All'}</strong></div>
        </div>
      );
    }

    return null;
  };

  const renderReportTable = () => {
    if (loading) {
      return <p className="loading">Loading report...</p>;
    }

    if (reportTab === 'sales') {
      return (
        <div className="report-table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Product</th>
                <th>Branch</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
                <th>Customer</th>
                <th>Seller</th>
                <th>Payment</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {salesData.length > 0 ? salesData.map((sale) => (
                <tr key={sale._id}>
                  <td>{sale.invoiceNumber}</td>
                  <td>{sale.productId?.productName || '-'}</td>
                  <td>{sale.branchId?.branchName || '-'}</td>
                  <td>{sale.quantitySold}</td>
                  <td>{formatCurrency(sale.salePrice)}</td>
                  <td>{formatCurrency(sale.totalAmount)}</td>
                  <td>{sale.customerName || '-'}</td>
                  <td>{sale.soldBy || '-'}</td>
                  <td>{sale.paymentMethod || '-'}</td>
                  <td>{sale.saleDate ? new Date(sale.saleDate).toLocaleString() : '-'}</td>
                </tr>
              )) : (
                <tr><td colSpan="10">No sales records found for the selected filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      );
    }

    if (reportTab === 'transfers') {
      return (
        <div className="report-table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Transfer #</th>
                <th>Product</th>
                <th>From</th>
                <th>To</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Transferred By</th>
                <th>Transfer Date</th>
                <th>Received Date</th>
              </tr>
            </thead>
            <tbody>
              {transferData.length > 0 ? transferData.map((item) => (
                <tr key={item._id}>
                  <td>{item.transferNumber}</td>
                  <td>{item.productId?.productName || '-'}</td>
                  <td>{item.fromBranchId?.branchName || '-'}</td>
                  <td>{item.toBranchId?.branchName || '-'}</td>
                  <td>{item.quantityTransferred}</td>
                  <td>{item.status}</td>
                  <td>{item.transferredBy || '-'}</td>
                  <td>{item.transferDate ? new Date(item.transferDate).toLocaleString() : '-'}</td>
                  <td>{item.receivedDate ? new Date(item.receivedDate).toLocaleDateString() : '-'}</td>
                </tr>
              )) : (
                <tr><td colSpan="9">No transfer records found for the selected filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      );
    }

    if (reportTab === 'receiving') {
      return (
        <div className="report-table-wrapper">
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
              {receivingData.length > 0 ? receivingData.map((item) => (
                <tr key={item._id}>
                  <td>{item.receiptNumber}</td>
                  <td>{item.productId?.productName || '-'}</td>
                  <td>{item.branchId?.branchName || '-'}</td>
                  <td>{item.quantityReceived}</td>
                  <td>{item.supplierName || '-'}</td>
                  <td>{item.receivedBy || '-'}</td>
                  <td>{item.receiveDate ? new Date(item.receiveDate).toLocaleDateString() : '-'}</td>
                </tr>
              )) : (
                <tr><td colSpan="7">No receiving records found for the selected filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      );
    }

    if (reportTab === 'inventory') {
      return (
        <div className="report-table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Branch</th>
                <th>Serial No.</th>
                <th>Received</th>
                <th>Transferred</th>
                <th>Sold</th>
                <th>Current Stock</th>
                <th>Last Restock</th>
              </tr>
            </thead>
            <tbody>
              {inventoryData.length > 0 ? inventoryData.map((item) => (
                <tr key={item._id}>
                  <td>{item.productId?.productName || '-'}</td>
                  <td>{item.branchId?.branchName || '-'}</td>
                  <td>{item.serialNumber || '-'}</td>
                  <td>{item.quantityReceived}</td>
                  <td>{item.quantityTransferred}</td>
                  <td>{item.quantitySold}</td>
                  <td>{item.currentQuantity}</td>
                  <td>{item.lastRestockDate ? new Date(item.lastRestockDate).toLocaleDateString() : '-'}</td>
                </tr>
              )) : (
                <tr><td colSpan="8">No inventory records found for the selected filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="reports-center">
      <div className="reports-header">
        <h2>Reports Center</h2>
        <p>Generate exportable reports for sales, transfers, product receiving, and branch inventory.</p>
      </div>

      <div className="reports-tabs">
        <button
          type="button"
          className={`report-tab ${reportTab === 'sales' ? 'active' : ''}`}
          onClick={() => setReportTab('sales')}
        >Sales</button>
        <button
          type="button"
          className={`report-tab ${reportTab === 'transfers' ? 'active' : ''}`}
          onClick={() => setReportTab('transfers')}
        >Transfers</button>
        <button
          type="button"
          className={`report-tab ${reportTab === 'receiving' ? 'active' : ''}`}
          onClick={() => setReportTab('receiving')}
        >Receiving</button>
        <button
          type="button"
          className={`report-tab ${reportTab === 'inventory' ? 'active' : ''}`}
          onClick={() => setReportTab('inventory')}
        >Inventory</button>
      </div>

      <div className="reports-controls">
        <div className="control-group">
          <label>Branch:</label>
          <select value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)}>
            <option value="">All Branches</option>
            {branches.map((branch) => (
              <option key={branch._id} value={branch._id}>
                {branch.branchName} ({branch.branchCode})
              </option>
            ))}
          </select>
        </div>

        {(reportTab === 'sales' || reportTab === 'receiving') && (
          <>
            <div className="control-group">
              <label>From</label>
              <input type="date" name="startDate" value={dateRange.startDate} onChange={updateDateRange} />
            </div>
            <div className="control-group">
              <label>To</label>
              <input type="date" name="endDate" value={dateRange.endDate} onChange={updateDateRange} />
            </div>
          </>
        )}

        <div className="report-actions">
          <button type="button" className="btn btn-secondary" onClick={fetchCurrentReport}>Refresh</button>
          <button type="button" className="btn btn-primary" onClick={exportToExcel}>Export to Excel</button>
          <button type="button" className="btn btn-secondary" onClick={exportToPdf}>Export to PDF</button>
        </div>
      </div>

      {message && <div className="report-message">{message}</div>}

      <div id="report-export-area" className="report-export-area">
        {renderSummary()}
        {renderReportTable()}
      </div>
    </div>
  );
}
