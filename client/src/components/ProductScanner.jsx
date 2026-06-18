import React, { useState, useEffect, useRef } from 'react';
import jsQR from 'jsqr';
import './ProductScanner.css';

export default function ProductScanner() {
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [scanCode, setScanCode] = useState('');
  const [products, setProducts] = useState([]);
  const [scannedProduct, setScannedProduct] = useState(null);
  const [productMatches, setProductMatches] = useState([]);
  const quantityInputRef = useRef(null);
  const posFormRef = useRef(null);
  const [formData, setFormData] = useState({
    quantitySold: '',
    customerName: '',
    salePrice: '',
    paymentMethod: 'cash',
    postSaleAction: 'save_only',
    soldBy: '',
    discount: '',
    discountPercent: '',
    taxPercent: '0',
    amountPaid: ''
  });
  const [receiptTemplates, setReceiptTemplates] = useState([
    { id: 'withLogo', name: 'With Logo' },
    { id: 'simple', name: 'Simple' },
    { id: 'compact', name: 'Compact' }
  ]);
  const [selectedReceiptTemplate, setSelectedReceiptTemplate] = useState('withLogo');
  const [companyLogoUrl, setCompanyLogoUrl] = useState(localStorage.getItem('companyLogoUrl') || '');
  const locale = navigator.language || 'en-US';
  const regionCurrencyMap = {
    US: 'USD',
    PH: 'PHP',
    GB: 'GBP',
    CA: 'CAD',
    AU: 'AUD',
    EU: 'EUR',
    DE: 'EUR',
    FR: 'EUR',
    JP: 'JPY',
    CN: 'CNY',
    IN: 'INR'
  };
  const currencyCode = regionCurrencyMap[(locale.split('-')[1] || '').toUpperCase()] || 'USD';
  const formatCurrency = (value) => {
    const amount = Number(value) || 0;
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };
  const currencySymbol = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).formatToParts(0).find(part => part.type === 'currency')?.value || currencyCode;
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
    fetchProducts();
    fetchSales();
    loadVideoDevices();
    // load saved templates
    try {
      const saved = localStorage.getItem('receiptTemplates');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setReceiptTemplates(parsed);
          setSelectedReceiptTemplate(parsed[0].id);
        }
      }
      const logo = localStorage.getItem('companyLogoUrl');
      if (logo) setCompanyLogoUrl(logo);
    } catch (err) {
      console.warn('Error loading receipt templates', err);
    }
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (!e.data) return;
      if (e.data.type === 'receiptTemplatesUpdated') {
        const templates = e.data.templates || [];
        setReceiptTemplates(templates);
        if (templates.length > 0) setSelectedReceiptTemplate(templates[0].id);
        if (e.data.companyLogoUrl) setCompanyLogoUrl(e.data.companyLogoUrl);
        try {
          localStorage.setItem('receiptTemplates', JSON.stringify(templates));
          localStorage.setItem('companyLogoUrl', e.data.companyLogoUrl || '');
        } catch (err) {}
      }
    };

    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  useEffect(() => {
    if (!scanCode.trim()) {
      setProductMatches([]);
      return;
    }

    const lowerTerm = scanCode.trim().toLowerCase();
    const matches = products.filter(p =>
      p.serialNumber?.toLowerCase().includes(lowerTerm) ||
      p.productName?.toLowerCase().includes(lowerTerm) ||
      (p.brand && p.brand.toLowerCase().includes(lowerTerm))
    );

    setProductMatches(matches.slice(0, 10));
  }, [scanCode, products]);

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

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
      });
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
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
    setMessage('');
    setProductMatches([]);
    setScanCode('');
    setFormData(prev => ({ ...prev, salePrice: '' }));
    
    // Auto-focus quantity field and scroll to form
    setTimeout(() => {
      if (quantityInputRef.current) {
        quantityInputRef.current.focus();
        quantityInputRef.current.select();
      }
      if (posFormRef.current) {
        posFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
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

  const calculatePOSValues = () => {
    const qty = parseInt(formData.quantitySold) || 0;
    const price = formData.salePrice === '' ? 0 : parseFloat(formData.salePrice);
    const subtotal = qty * price;
    
    let discountAmount = 0;
    if (formData.discountPercent) {
      discountAmount = subtotal * (parseFloat(formData.discountPercent) / 100);
    } else if (formData.discount) {
      discountAmount = parseFloat(formData.discount);
    }
    
    const subtotalAfterDiscount = subtotal - discountAmount;
    const taxPercent = parseFloat(formData.taxPercent) || 0;
    const taxAmount = subtotalAfterDiscount * (taxPercent / 100);
    const total = subtotalAfterDiscount + taxAmount;
    const change = parseFloat(formData.amountPaid) - total;
    
    return { subtotal, discountAmount, subtotalAfterDiscount, taxAmount, total, change };
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
      const { total } = calculatePOSValues();

      const salePayload = {
        productId: scannedProduct._id,
        branchId: selectedBranch,
        serialNumber: scannedProduct.serialNumber,
        scanCode: scannedProduct.serialNumber,
        quantitySold: parseInt(formData.quantitySold),
        customerName: formData.customerName,
        salePrice: formData.salePrice === '' ? 0 : parseFloat(formData.salePrice),
        totalAmount: total,
        paymentMethod: formData.paymentMethod,
        discount: parseFloat(formData.discount) || 0,
        discountPercent: parseFloat(formData.discountPercent) || 0,
        taxPercent: parseFloat(formData.taxPercent) || 0,
        amountPaid: parseFloat(formData.amountPaid) || 0,
        soldBy: formData.soldBy,
        saleDate: new Date()
      };

      const doSave = async () => {
        const response = await fetch('/api/sales', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          },
          body: JSON.stringify(salePayload)
        });

        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error || 'Failed to save sale');
        }

        return response.json();
      };

      const printReceipt = (data) => {
        const saleInfo = data || salePayload;
        // build receipt HTML depending on selected template
        let logoHtml = '';
        if (companyLogoUrl && selectedReceiptTemplate !== 'compact') {
          logoHtml = `<div style="text-align:center;margin-bottom:10px"><img src="${companyLogoUrl}" style="max-width:160px;max-height:80px"/></div>`;
        }

        const simpleLayout = `
          <html><head><title>Receipt</title>
            <style>body{font-family:Arial;padding:20px}h2{text-align:center}.line{display:flex;justify-content:space-between}</style>
          </head><body>
            ${logoHtml}
            <h2>Receipt</h2>
            <div class="line"><strong>Product:</strong><span>${scannedProduct.productName}</span></div>
            <div class="line"><strong>Serial:</strong><span>${scannedProduct.serialNumber}</span></div>
            <div class="line"><strong>Qty:</strong><span>${saleInfo.quantitySold}</span></div>
            <div class="line"><strong>Unit:</strong><span>${formatCurrency(saleInfo.salePrice)}</span></div>
            <div class="line"><strong>Total:</strong><span>${formatCurrency(saleInfo.totalAmount)}</span></div>
            <div class="line"><strong>Payment:</strong><span>${saleInfo.paymentMethod}</span></div>
            <div style="margin-top:20px;text-align:center">Thank you!</div>
          </body></html>`;

        const compactLayout = `
          <html><head><title>Receipt</title>
            <style>body{font-family:Arial;padding:10px;font-size:12px}.line{display:flex;justify-content:space-between}</style>
          </head><body>
            <div class="line"><strong>${scannedProduct.productName}</strong><span>${saleInfo.quantitySold} x ${formatCurrency(saleInfo.salePrice)}</span></div>
            <hr/>
            <div class="line"><strong>Total</strong><span>${formatCurrency(saleInfo.totalAmount)}</span></div>
            <div style="margin-top:10px;text-align:center">Thank you!</div>
          </body></html>`;

        const html = selectedReceiptTemplate === 'compact' ? compactLayout : simpleLayout;

        const w = window.open('', '_blank', 'width=400,height=600');
        if (!w) { setMessage('Unable to open print window (popup blocked).'); return; }
        w.document.open();
        w.document.write(html);
        w.document.close();
        w.focus();
        w.print();
      };

      if (formData.postSaleAction === 'print_before_save') {
        printReceipt(salePayload);
        await doSave();
        setMessage('Sale saved and receipt printed.');
      } else if (formData.postSaleAction === 'save_and_print') {
        const saved = await doSave();
        // saved may contain sale property
        printReceipt((saved && saved.sale) ? saved.sale : saved);
        setMessage('Sale recorded and receipt printed.');
      } else {
        await doSave();
        setMessage('Sale recorded successfully!');
      }

      setFormData({
        quantitySold: '',
        customerName: '',
        salePrice: '',
        paymentMethod: 'cash',
        postSaleAction: 'save_only',
        soldBy: '',
        discount: '',
        discountPercent: '',
        taxPercent: '0',
        amountPaid: ''
      });
      setScannedProduct(null);
      fetchSales();
      if (scanInputRef.current) scanInputRef.current.focus();
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
                <label>Type serial / name or scan QR/Barcode *</label>
                <input
                  ref={scanInputRef}
                  type="text"
                  value={scanCode}
                  onChange={(e) => setScanCode(e.target.value)}
                  placeholder={cameraEnabled ? "Camera active - point at QR code or type manually..." : "Type serial or product name..."}
                  autoFocus={!cameraEnabled}
                  disabled={loading}
                />
                <button type="submit" className="btn btn-scan" disabled={loading}>
                  {loading ? 'Searching...' : 'Find Product'}
                </button>
              </div>
            </form>

            {productMatches.length > 0 && (
              <div className="product-matches">
                <h3>Matched Products</h3>
                <div className="match-list">
                  {productMatches.map(product => (
                    <button
                      key={product._id}
                      type="button"
                      className="match-item btn btn-secondary"
                      onClick={() => {
                        setScanCode(product.serialNumber);
                        loadProductFromInventory(product);
                      }}
                    >
                      <span className="match-name">{product.productName} ({product.serialNumber})</span>
                      <span className="match-price">{formatCurrency(product.sellingPrice || 0)}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {scannedProduct && (
        <div className="product-details" ref={posFormRef}>
          <h3>Product Details</h3>
          <div className="details-grid">
            <div><strong>Product:</strong> {scannedProduct.productName}</div>
            <div><strong>Brand:</strong> {scannedProduct.brand}</div>
            <div><strong>Serial:</strong> {scannedProduct.serialNumber}</div>
            <div><strong>Available:</strong> {scannedProduct.currentQuantity} units</div>
            <div><strong>Selling Price:</strong> {formatCurrency(scannedProduct.sellingPrice || 0)}</div>
            <div><strong>Cost Price:</strong> {formatCurrency(scannedProduct.costPrice || 0)}</div>
          </div>

          <form onSubmit={handleCompleteSale} className="sale-form">
            <div className="form-row">
              <div className="form-group">
                <label>Quantity Sold *</label>
                <input
                  ref={quantityInputRef}
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
                <label>Unit Price</label>
                <input
                  type="text"
                  name="salePrice"
                  value={formData.salePrice}
                  onChange={handleInputChange}
                  inputMode="decimal"
                  step="0.01"
                  placeholder="Enter unit price"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Discount ({currencySymbol})</label>
                <input
                  type="number"
                  name="discount"
                  value={formData.discount}
                  onChange={handleInputChange}
                  step="0.01"
                  placeholder="Fixed amount"
                />
              </div>

              <div className="form-group">
                <label>Discount (%)</label>
                <input
                  type="number"
                  name="discountPercent"
                  value={formData.discountPercent}
                  onChange={handleInputChange}
                  step="0.01"
                  placeholder="Percentage"
                />
              </div>

              <div className="form-group">
                <label>Tax (%)</label>
                <input
                  type="number"
                  name="taxPercent"
                  value={formData.taxPercent}
                  onChange={handleInputChange}
                  step="0.01"
                  placeholder="Tax percentage"
                />
              </div>
            </div>

            <div className="pos-summary">
              {(() => {
                const { subtotal, discountAmount, subtotalAfterDiscount, taxAmount, total } = calculatePOSValues();
                return (
                  <>
                    <div className="summary-row"><span>Subtotal:</span><strong>{formatCurrency(subtotal)}</strong></div>
                    {discountAmount > 0 && <div className="summary-row discount"><span>Discount:</span><strong>-{formatCurrency(discountAmount)}</strong></div>}
                    {taxAmount > 0 && <div className="summary-row tax"><span>Tax:</span><strong>+{formatCurrency(taxAmount)}</strong></div>}
                    <div className="summary-row total"><span>Total Amount:</span><strong>{formatCurrency(total)}</strong></div>
                  </>
                );
              })()}
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
                <option value="swipe">Swipe</option>
                <option value="zig">ZIG</option>
                <option value="card">Card</option>
                <option value="transfer">Bank Transfer</option>
                <option value="cheque">Cheque</option>
              </select>
            </div>

            {formData.paymentMethod === 'cash' && (
              <div className="form-group full-width">
                <label>Amount Paid</label>
                <input
                  type="number"
                  name="amountPaid"
                  value={formData.amountPaid}
                  onChange={handleInputChange}
                  step="0.01"
                  placeholder="Cash amount received"
                />
                {formData.amountPaid && (() => {
                  const { total, change } = calculatePOSValues();
                  const changeAmount = parseFloat(formData.amountPaid) - total;
                  return (
                    <div className={`change-display ${changeAmount >= 0 ? 'valid' : 'invalid'}`}>
                      Change: {formatCurrency(changeAmount)}
                    </div>
                  );
                })()}
              </div>
            )}

            <div className="form-group full-width">
              <label>After Sale</label>
              <select
                name="postSaleAction"
                value={formData.postSaleAction}
                onChange={handleInputChange}
              >
                <option value="save_only">Save only</option>
                <option value="save_and_print">Save and print</option>
                <option value="print_before_save">Print before save</option>
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Receipt Template</label>
                <select value={selectedReceiptTemplate} onChange={(e) => setSelectedReceiptTemplate(e.target.value)}>
                  {receiptTemplates.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>&nbsp;</label>
                <button type="button" className="btn btn-secondary" onClick={() => {
                  // open a simple template designer window
                  const w = window.open('', '_blank', 'width=600,height=500');
                  if (!w) { setMessage('Unable to open template designer (popup blocked).'); return; }
                  const initTemplates = JSON.stringify(receiptTemplates || []);
                  const initLogo = companyLogoUrl || '';
                  w.document.write(`
                    <html><head><title>Receipt Designer</title>
                      <style>body{font-family:Arial;padding:20px}label{display:block;margin-top:10px}li{margin:6px 0}</style>
                    </head><body>
                      <h2>Receipt Designer</h2>
                      <label>Company Logo URL</label>
                      <input id="logo" style="width:100%" value="${initLogo}" />
                      <label>Templates (name,id) — edit names or remove</label>
                      <ul id="tpls"></ul>
                      <button id="add">Add Template</button>
                      <div style="margin-top:12px"><button id="save">Save</button> <button id="close">Close</button></div>
                      <script>
                        const openerRef = window.opener;
                        let templates = ${initTemplates};
                        const tplsEl = document.getElementById('tpls');
                        function render(){ tplEls = templates.map((t, i) => `<li data-i="${i}"><input data-i="${i}" class="name" value="${t.name}"/> <input data-i="${i}" class="id" value="${t.id}"/> <button data-i="${i}" class="remove">Remove</button></li>`).join(''); tplsEl.innerHTML = tplEls; document.querySelectorAll('.remove').forEach(b=>b.onclick=(e)=>{ const i=parseInt(e.target.dataset.i); templates.splice(i,1); render(); }); document.querySelectorAll('.name').forEach(inp=>inp.oninput=(e)=>{ templates[parseInt(e.target.dataset.i)].name = e.target.value; }); document.querySelectorAll('.id').forEach(inp=>inp.oninput=(e)=>{ templates[parseInt(e.target.dataset.i)].id = e.target.value; }); }
                        render();
                        document.getElementById('add').onclick = ()=>{ templates.push({ id: 'tpl'+Date.now(), name: 'New Template' }); render(); };
                        document.getElementById('save').onclick = ()=>{
                          const logo = document.getElementById('logo').value || '';
                          if(openerRef) openerRef.postMessage({ type: 'receiptTemplatesUpdated', templates, companyLogoUrl: logo }, '*');
                          localStorage.setItem('receiptTemplates', JSON.stringify(templates));
                          localStorage.setItem('companyLogoUrl', logo);
                          window.close();
                        };
                        document.getElementById('close').onclick = ()=>window.close();
                      </script>
                    </body></html>
                  `);
                }}>Design Print</button>
              </div>
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
