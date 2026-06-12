import React, { useState, useEffect } from 'react';
import axios from 'axios';
import QRCode from 'react-qr-code';
import { getAppOrigin } from '../utils/getAppOrigin';
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

  const handlePrint = () => {
    const qrElement = document.querySelector('#product-qr-code svg');
    if (!qrElement) {
      alert('Please wait for the QR code to render before printing.');
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

        <div className="qr-section">
          <h2>QR Code</h2>
          <div id="product-qr-code" className="qr-code-box">
            <QRCode
              value={`${getAppOrigin()}/product/${product.id || product._id}`}
              size={220}
              bgColor="#ffffff"
              fgColor="#000000"
              level="H"
            />
          </div>
          <button onClick={handlePrint} className="btn-print">
            🖨️ Print QR Code
          </button>
        </div>

        <div className="action-buttons">
          <button onClick={() => window.print()} className="btn-print">
            🖨️ Print
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
