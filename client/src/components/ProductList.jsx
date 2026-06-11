import React from 'react';
import QRCode from 'react-qr-code';
import './ProductList.css';

function ProductList({ products, selectedProduct, onSelectProduct, onDeleteProduct, onEditProduct, onGenerateQR }) {
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
              <div className="qr-container">
                <QRCode 
                  value={`${window.location.origin}/product/${itemId}`}
                  size={100} 
                />
              </div>
            )}

            <div className="product-item-actions">
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
