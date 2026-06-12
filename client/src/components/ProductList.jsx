import React from 'react';
import QRCode from 'react-qr-code';
import { getAppOrigin } from '../utils/getAppOrigin';
import './ProductList.css';

function ProductList({ products, selectedProduct, onSelectProduct, onDeleteProduct, onEditProduct, onGenerateQR }) {
  const handlePrint = (product) => {
    const itemId = product.id || product._id;
    const qrElement = document.querySelector(`#qr-code-${itemId} svg`);
    if (!qrElement) {
      alert('Please generate a QR code first.');
      return;
    }

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(qrElement);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    const image = new Image();

    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      const imgData = canvas.toDataURL('image/png');

      const printWindow = window.open('', '', 'width=800,height=600');
      printWindow.document.write(`
        <html>
          <head>
            <title>Print QR Code - ${product.serialNumber}</title>
          </head>
          <body style="display: flex; flex-direction: column; align-items: center; padding: 20px; font-family: Arial, sans-serif;">
            <h2 style="margin-bottom: 10px;">${product.productName}</h2>
            <p style="margin: 4px 0;"><strong>Serial Number:</strong> ${product.serialNumber}</p>
            <img src="${imgData}" alt="QR Code" style="margin: 20px 0; width: 240px; height: 240px;" />
            <p style="margin-top: 20px; text-align: center;">
              <strong>Scan this QR code to view product details</strong>
            </p>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    };

    image.src = url;
  };

  if (products.length === 0) {
    return (
      <div className="empty-state">
        <p>No products found. Create your first product to get started!</p>
      </div>
    );
  }

  return (
    <div className="product-list">
      <h3>Products ({products.length})</h3>
      <div className="products-container">
        {products.map(product => {
          const itemId = product.id || product._id;
          return (
            <div
              key={itemId}
              className={`product-item ${selectedProduct?.id === itemId ? 'selected' : ''}`}
              onClick={() => onSelectProduct(product)}
            >
            <div className="product-item-header">
              <h4>{product.productName}</h4>
              <span className="serial-number">{product.serialNumber}</span>
            </div>

            <div className="product-item-details">
              <p><strong>Brand:</strong> {product.brand}</p>
              <p><strong>Type:</strong> {product.paintType}</p>
              <p><strong>Qty:</strong> {product.quantity}</p>
              <p><strong>Expiry:</strong> {new Date(product.expiryDate).toLocaleDateString()}</p>
            </div>

            {product.qrCode && (
              <div id={`qr-code-${itemId}`} className="qr-container">
                <QRCode 
                  value={`${getAppOrigin()}/product/${itemId}`}
                  size={100} 
                />
              </div>
            )}

            <div className="product-item-actions">
              <button
                className="btn-print"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrint(product);
                }}
                title={product.qrCode ? 'Print QR Code' : 'Generate QR code first'}
              >
                🖨️ Print
              </button>
              <button
                className="btn-qr"
                onClick={(e) => {
                  e.stopPropagation();
                  onGenerateQR(itemId);
                }}
                title="Generate QR Code"
              >
                📱 QR
              </button>
              <button
                className="btn-edit"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditProduct(product);
                }}
                title="Edit product"
              >
                ✏️ Edit
              </button>
              <button
                className="btn-delete"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteProduct(itemId);
                }}
                title="Delete product"
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        )})}
      </div>
    </div>
  );
}

export default ProductList;
