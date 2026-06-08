import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import './App.css';
import ProductForm from './components/ProductForm';
import ProductList from './components/ProductList';
import ProductDetails from './components/ProductDetails';
import SavedPaints from './components/SavedPaints';
import PaintTypesManager from './components/PaintTypesManager';
import QRCode from 'react-qr-code';
import axios from 'axios';

function ProductDetailsPage() {
  const { id } = useParams();
  return <ProductDetails productId={id} />;
}

function AppContent() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const normalizeId = (item) => item.id || item._id || (item._id ? item._id.toString() : undefined);
  const normalizeItems = (items) => items.map(item => ({ ...item, id: normalizeId(item) }));

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      setProducts(normalizeItems(response.data));
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleAddProduct = async (productData) => {
    try {
      await axios.post('/api/products', productData);
      fetchProducts();
      setShowForm(false);
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleUpdateProduct = async (id, productData) => {
    try {
      await axios.put(`/api/products/${id}`, productData);
      fetchProducts();
      setEditingProduct(null);
      setShowForm(false);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`/api/products/${id}`);
        fetchProducts();
        if (selectedProduct?.id === id) {
          setSelectedProduct(null);
        }
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <img src="/monash-logo.png" alt="Monash Logo" className="app-logo" />
          <div className="header-text">
            <h1>🎨 Paint QR Code Generator System</h1>
            <p>Generate and manage QR codes for your paint products</p>
          </div>
        </div>
      </header>

      <footer className="app-footer">
        <p>© 2026 Munashe Mudondo. All rights reserved. | Paint QR Code Generator System</p>
      </footer>

      <div className="app-container">
        <div className="left-panel">
          <div className="action-buttons">
            <button 
              className="btn btn-primary"
              onClick={() => {
                setEditingProduct(null);
                setShowForm(!showForm);
              }}
            >
              {showForm ? 'Cancel' : '+ Add New Product'}
            </button>
          </div>

          {showForm && (
            <ProductForm 
              onSubmit={editingProduct ? 
                (data) => handleUpdateProduct(editingProduct.id, data) :
                handleAddProduct
              }
              initialData={editingProduct}
            />
          )}

          <ProductList 
            products={products}
            selectedProduct={selectedProduct}
            onSelectProduct={setSelectedProduct}
            onDeleteProduct={handleDeleteProduct}
            onEditProduct={(product) => {
              setEditingProduct(product);
              setShowForm(true);
            }}
          />

          <SavedPaints />
          <PaintTypesManager />
        </div>

        <div className="right-panel">
          {selectedProduct ? (
            <div className="product-details">
              <h2>Product Details & QR Code</h2>
              <div className="details-container">
                <div className="detail-row">
                  <span className="label">Serial Number:</span>
                  <span className="value">{selectedProduct.serialNumber}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Product Name:</span>
                  <span className="value">{selectedProduct.productName}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Brand:</span>
                  <span className="value">{selectedProduct.brand}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Paint Type:</span>
                  <span className="value">{selectedProduct.paintType}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Quantity:</span>
                  <span className="value">{selectedProduct.quantity}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Expiry Date:</span>
                  <span className="value">{selectedProduct.expiryDate}</span>
                </div>
              </div>

              <div id="qr-code-section" className="qr-section">
                <QRCodeDisplay product={selectedProduct} />
              </div>
            </div>
          ) : (
            <div className="no-selection">
              <p>Select a product to view details and generate QR code</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function QRCodeDisplay({ product }) {
  const handleDownload = (format) => {
    const qrElement = document.querySelector('#qr-code-ref');
    const svg = qrElement.querySelector('svg');
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);
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
      const dataUrl = canvas.toDataURL(`image/${format}`);
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `${product.serialNumber}.${format}`;
      link.click();
    };

    image.src = url;
  };

  const handlePrint = () => {
    const qrElement = document.querySelector('#qr-code-ref');
    const svg = qrElement.querySelector('svg');
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);
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
          <body style="display: flex; flex-direction: column; align-items: center; padding: 20px;">
            <h2>${product.productName}</h2>
            <p><strong>Serial Number:</strong> ${product.serialNumber}</p>
            <img src="${imgData}" />
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

  return (
    <div className="qr-display">
      <div id="qr-code-ref" className="qr-code-container">
        <QRCode 
          value={`${window.location.origin}/product/${product.id}`}
          size={256}
          bgColor="#ffffff"
          fgColor="#000000"
          level="H"
        />
      </div>
      <div className="qr-actions">
        <button className="btn btn-secondary" onClick={() => handleDownload('png')}>
          📥 Download PNG
        </button>
        <button className="btn btn-secondary" onClick={() => handleDownload('jpg')}>
          📥 Download JPG
        </button>
        <button className="btn btn-secondary" onClick={handlePrint}>
          🖨️ Print
        </button>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/product/:id" element={<ProductDetailsPage />} />
        <Route path="/" element={<AppContent />} />
      </Routes>
    </Router>
  );
}

export default App;
