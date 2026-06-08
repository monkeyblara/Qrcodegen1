import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProductDetails.css';

function ProductDetails({ productId }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/api/products/${productId}`);
        setProduct(response.data);
        setError(null);
      } catch (err) {
        setError('Product not found or server error');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  if (loading) {
    return <div className="product-details-page loading">Loading product details...</div>;
  }

  if (error || !product) {
    return (
      <div className="product-details-page error">
        <h1>❌ Error</h1>
        <p>{error || 'Product not found'}</p>
      </div>
    );
  }

  return (
    <div className="product-details-page">
      <div className="details-card">
        <h1>🎨 Product Information</h1>
        <div className="detail-section">
          <h2>Serial Number</h2>
          <p className="serial-number">{product.serialNumber}</p>
        </div>

        <div className="detail-section">
          <h2>Product Name</h2>
          <p>{product.productName}</p>
        </div>

        <div className="detail-section">
          <h2>Brand</h2>
          <p>{product.brand}</p>
        </div>

        <div className="detail-section">
          <h2>Paint Type</h2>
          <p>{product.paintType}</p>
        </div>

        <div className="detail-section">
          <h2>Quantity</h2>
          <p>{product.quantity}</p>
        </div>

        <div className="detail-section">
          <h2>Expiry Date</h2>
          <p className={isExpired(product.expiryDate) ? 'expired' : ''}>
            {new Date(product.expiryDate).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
            {isExpired(product.expiryDate) && <span className="warning"> - EXPIRED</span>}
          </p>
        </div>

        <div className="detail-section">
          <h2>Added On</h2>
          <p>{new Date(product.createdAt).toLocaleString()}</p>
        </div>

        {product.updatedAt && product.updatedAt !== product.createdAt && (
          <div className="detail-section">
            <h2>Last Updated</h2>
            <p>{new Date(product.updatedAt).toLocaleString()}</p>
          </div>
        )}

        <div className="action-buttons">
          <button onClick={() => window.print()} className="btn-print">
            🖨️ Print
          </button>
          <button onClick={() => window.history.back()} className="btn-back">
            ← Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

function isExpired(expiryDate) {
  return new Date(expiryDate) < new Date();
}

export default ProductDetails;
