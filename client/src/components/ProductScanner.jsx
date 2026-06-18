import React, { useState, useEffect, useRef } from 'react';
import jsQR from 'jsqr';
import './ProductScanner.css';

export default function ProductScanner() {
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [scanCode, setScanCode] = useState('');
  const [scannedProduct, setScannedProduct] = useState(null);
  const [productMatches, setProductMatches] = useState([]);
  const [formData, setFormData] = useState({
    quantitySold: '',
    customerName: '',
    salePrice: '',
    paymentMethod: 'cash',
    soldBy: ''
  });
  const [message, setMessage] = useState('');
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const scanInputRef = useRef(null);
  
  // Camera state
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(null);
  const [videoDevices, setVideoDevices] = useState([]);
  const [selectedVideoDeviceId, setSelectedVideoDeviceId] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    fetchBranches();
    fetchSales();
    loadVideoDevices();
  }, []);

  const loadVideoDevices = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      return;
    }

    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoInputs = devices.filter(device => device.kind === 'videoinput');
      setVideoDevices(videoInputs);
      if (!selectedVideoDeviceId && videoInputs.length > 0) {
        setSelectedVideoDeviceId(selectPreferredVideoDevice(videoInputs));
      }
    } catch (error) {
      console.error('Error enumerating video devices:', error);
    }
  };

  const selectPreferredVideoDevice = (videoInputs) => {
    // Prefer rear/back camera on mobile devices, then any named camera.
    const lowerLabels = videoInputs.map(device => ({
      ...device,
      label: device.label.toLowerCase()
    }));

    const rearCamera = lowerLabels.find(device =>
      device.label.includes('back') ||
      device.label.includes('rear') ||
      device.label.includes('environment') ||
      device.label.includes('wide')
    );

    if (rearCamera) {
      return rearCamera.deviceId;
    }

    const frontCamera = lowerLabels.find(device =>
      device.label.includes('front') ||
      device.label.includes('selfie')
    );

    if (frontCamera) {
      return frontCamera.deviceId;
    }

    return videoInputs[0].deviceId;
  };

  useEffect(() => {
    if (scanInputRef.current) {
      scanInputRef.current.focus();
    }
  }, [selectedBranch]);

  // Camera permission and setup
  const startCamera = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setMessage('Camera API is not available in this browser.');
      return;
    }

    try {
      const videoInputs = videoDevices.length > 0 ? videoDevices : (await navigator.mediaDevices.enumerateDevices()).filter(device => device.kind === 'videoinput');
      let preferredDeviceId = selectedVideoDeviceId;

      if (!preferredDeviceId && videoInputs.length > 0) {
        preferredDeviceId = selectPreferredVideoDevice(videoInputs);
        setSelectedVideoDeviceId(preferredDeviceId);
      }

      const constraints = {
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          ...(preferredDeviceId ? { deviceId: { exact: preferredDeviceId } } : { facingMode: 'environment' })
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play().catch((err) => {
            console.warn('Video play failed:', err);
          });
        };
      }
      setCameraPermission('granted');
      setCameraEnabled(true);
      await loadVideoDevices();
    } catch (error) {
      console.error('Error accessing camera:', error);
      setCameraPermission('denied');
      setMessage('Camera permission denied, no camera found, or the selected camera is unavailable.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraEnabled(false);
  };

  // QR Code scanning loop
  useEffect(() => {
    if (!cameraEnabled || !videoRef.current || !canvasRef.current) return;

    const interval = setInterval(() => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        
        if (code && code.data) {
          // Extract serial number from QR code
          const detectedCode = code.data.includes('/product/') 
            ? code.data.split('/product/')[1] 
            : code.data;
          
          setScanCode(detectedCode);
          setMessage(`QR Code detected: ${detectedCode}`);
        }
      }
    }, 200);

    return () => clearInterval(interval);
  }, [cameraEnabled]);

  // Auto-submit scan when code is detected and branch is selected
  useEffect(() => {
    if (scanCode && selectedBranch && cameraEnabled) {
      const timer = setTimeout(() => {
        handleScanDetected();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [scanCode]);

  const fetchBranches = async () => {
    try {
      const response = await fetch('/api/branches/active/list', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
      });
      const data = await response.json();
      setBranches(data);
    } catch (error) {
      console.error('Error fetching branches:', error);
    }
  };

  const fetchSales = async () => {
    try {
      const response = await fetch('/api/sales', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
      });
      const data = await response.json();
      setSales(data);
    } catch (error) {
      console.error('Error fetching sales:', error);
    }
  };

  const handleScan = async (e) => {
    e.preventDefault();
    await processScan();
  };

  const handleScanDetected = async () => {
    await processScan();
  };

  const loadProductFromInventory = async (product) => {
    const inventoryResponse = await fetch(`/api/inventory/branch/${selectedBranch}/product/${product._id}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
    });

    if (!inventoryResponse.ok) {
      setMessage('This product is not available in selected branch');
      setProductMatches([]);
      setScannedProduct(null);
      return;
    }

    const inventory = await inventoryResponse.json();
    setScannedProduct({ ...product, ...inventory });
    setMessage('Product found! Enter sale details below');
    setProductMatches([]);
    setScanCode('');
  };

  const processScan = async () => {
    if (!scanCode.trim() || !selectedBranch) {
      setMessage('Please select a branch and enter a product serial or name');
      return;
    }

    setLoading(true);
    setProductMatches([]);
    try {
      const productsResponse = await fetch('/api/products', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
      });
      const products = await productsResponse.json();
      const searchTerm = scanCode.trim();
      const lowerTerm = searchTerm.toLowerCase();

      const exactMatch = products.find(p =>
        p.serialNumber === searchTerm ||
        p.productName.toLowerCase() === lowerTerm ||
        (p.brand && p.brand.toLowerCase() === lowerTerm)
      );

      let product = exactMatch;
      if (!product) {
        const fuzzyMatches = products.filter(p =>
          p.serialNumber.toLowerCase() === lowerTerm ||
          p.productName.toLowerCase().includes(lowerTerm) ||
          (p.brand && p.brand.toLowerCase().includes(lowerTerm))
        );

        if (fuzzyMatches.length === 1) {
          product = fuzzyMatches[0];
        } else if (fuzzyMatches.length > 1) {
          setMessage('Multiple products matched. Please select the correct product.');
          setProductMatches(fuzzyMatches.slice(0, 10));
          setScanCode('');
          return;
        }
      }

      if (!product) {
        setMessage('Product not found. Enter a valid serial, product name, or scan the QR/Barcode.');
        setScanCode('');
        setScannedProduct(null);
        return;
      }

      await loadProductFromInventory(product);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCompleteSale = async (e) => {
    e.preventDefault();

    if (!scannedProduct || !formData.quantitySold || !formData.soldBy) {
      setMessage('Please fill all required fields');
      return;
    }

    if (parseInt(formData.quantitySold) > scannedProduct.currentQuantity) {
      setMessage('Quantity exceeds available stock');
      return;
    }

    try {
      const response = await fetch('/api/sales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          productId: scannedProduct._id,
          branchId: selectedBranch,
          serialNumber: scannedProduct.serialNumber,
          scanCode: scannedProduct.serialNumber,
          quantitySold: parseInt(formData.quantitySold),
          customerName: formData.customerName,
          salePrice: formData.salePrice ? parseFloat(formData.salePrice) : null,
          paymentMethod: formData.paymentMethod,
          soldBy: formData.soldBy,
          saleDate: new Date()
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      setMessage('Sale recorded successfully!');
      setFormData({
        quantitySold: '',
        customerName: '',
        salePrice: '',
        paymentMethod: 'cash',
        soldBy: ''
      });
      setScannedProduct(null);
      fetchSales();
      
      if (scanInputRef.current) {
        scanInputRef.current.focus();
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div className="product-scanner">
      <h2>Sell Products via QR/Barcode</h2>

      {message && <div className="message">{message}</div>}

      <div className="scanner-section">
        <h3>Scan or Enter Product</h3>
        
        <div className="branch-selector">
          <label>Select Branch *</label>
          <select
            value={selectedBranch}
            onChange={(e) => {
              setSelectedBranch(e.target.value);
              setScannedProduct(null);
              setProductMatches([]);
            }}
          >
            <option value="">-- Select Branch --</option>
            {branches.map(b => (
              <option key={b._id} value={b._id}>
                {b.branchName} ({b.branchCode})
              </option>
            ))}
          </select>
        </div>

        {selectedBranch && (
          <>
            <div className="camera-controls">
              <div className="camera-selector">
                <label>Camera</label>
                <select
                  value={selectedVideoDeviceId}
                  onChange={(e) => setSelectedVideoDeviceId(e.target.value)}
                  disabled={cameraEnabled}
                >
                  {videoDevices.length === 0 && (
                    <option value="">No cameras detected yet</option>
                  )}
                  {videoDevices.map((device) => (
                    <option key={device.deviceId} value={device.deviceId}>
                      {device.label || `Camera ${device.deviceId.substr(0, 8)}`}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                className="btn btn-secondary camera-btn"
                onClick={loadVideoDevices}
                disabled={cameraEnabled}
              >
                🔄 Refresh cameras
              </button>

              {!cameraEnabled ? (
                <button 
                  type="button"
                  className="btn btn-primary camera-btn"
                  onClick={startCamera}
                >
                  📷 Enable Camera Scan
                </button>
              ) : (
                <button 
                  type="button"
                  className="btn btn-danger camera-btn"
                  onClick={stopCamera}
                >
                  ❌ Disable Camera
                </button>
              )}
            </div>

            {cameraEnabled && (
              <div className="camera-container">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="camera-feed"
                  style={{ width: '100%', maxHeight: '400px', borderRadius: '8px' }}
                />
                <canvas ref={canvasRef} style={{ display: 'none' }} />
                <div className="scan-hint">Point camera at QR code...</div>
              </div>
            )}

            <form onSubmit={handleScan} className="scan-form">
              <div className="scan-input-group">
                <label>Scan QR Code / Barcode or enter serial / product name *</label>
                <input
                  ref={scanInputRef}
                  type="text"
                  value={scanCode}
                  onChange={(e) => setScanCode(e.target.value)}
                  placeholder={cameraEnabled ? "Camera active - point at QR code or type manually..." : "Enter serial or product name..."}
                  autoFocus={!cameraEnabled}
                  disabled={loading}
                />
                <button type="submit" className="btn btn-scan" disabled={loading}>
                  {loading ? 'Searching...' : 'Find Product'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>

      {productMatches.length > 0 && (
        <div className="product-matches">
          <h3>Matched Products</h3>
          <div className="match-list">
            {productMatches.map(product => (
              <button
                key={product._id}
                type="button"
                className="match-item btn btn-secondary"
                onClick={() => loadProductFromInventory(product)}
              >
                {product.productName} ({product.serialNumber})
              </button>
            ))}
          </div>
        </div>
      )}

      {scannedProduct && (
        <div className="product-details">
          <h3>Product Details</h3>
          <div className="details-grid">
            <div><strong>Product:</strong> {scannedProduct.productName}</div>
            <div><strong>Brand:</strong> {scannedProduct.brand}</div>
            <div><strong>Serial:</strong> {scannedProduct.serialNumber}</div>
            <div><strong>Available:</strong> {scannedProduct.currentQuantity} units</div>
          </div>

          <form onSubmit={handleCompleteSale} className="sale-form">
            <div className="form-row">
              <div className="form-group">
                <label>Quantity Sold *</label>
                <input
                  type="number"
                  name="quantitySold"
                  value={formData.quantitySold}
                  onChange={handleInputChange}
                  required
                  min="1"
                  max={scannedProduct.currentQuantity}
                />
              </div>

              <div className="form-group">
                <label>Sale Price</label>
                <input
                  type="number"
                  name="salePrice"
                  value={formData.salePrice}
                  onChange={handleInputChange}
                  step="0.01"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Customer Name</label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Sold By *</label>
                <input
                  type="text"
                  name="soldBy"
                  value={formData.soldBy}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-group full-width">
              <label>Payment Method</label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
              >
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="transfer">Bank Transfer</option>
                <option value="cheque">Cheque</option>
              </select>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-success">Complete Sale</button>
              <button
                type="button"
                className="btn btn-cancel"
                onClick={() => {
                  setScannedProduct(null);
                  setScanCode('');
                  if (scanInputRef.current) scanInputRef.current.focus();
                }}
              >
                Cancel & Scan Another
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="sales-history">
        <h3>Today's Sales</h3>
        <table>
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
              <th>Customer</th>
              <th>Seller</th>
              <th>Payment</th>
            </tr>
          </thead>
          <tbody>
            {sales
              .filter(s => new Date(s.saleDate).toDateString() === new Date().toDateString())
              .slice(0, 10)
              .map(sale => (
                <tr key={sale._id}>
                  <td>{sale.invoiceNumber}</td>
                  <td>{sale.productId?.productName}</td>
                  <td>{sale.quantitySold}</td>
                  <td>{sale.salePrice || '-'}</td>
                  <td>{sale.totalAmount || '-'}</td>
                  <td>{sale.customerName || '-'}</td>
                  <td>{sale.soldBy}</td>
                  <td>{sale.paymentMethod}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}
