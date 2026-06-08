const http = require('http');

const BASE_URL = 'http://localhost:5000';
let testsPassed = 0;
let testsFailed = 0;

// Helper function to make HTTP requests
const makeRequest = (method, path, body = null) => {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            body: data ? JSON.parse(data) : null,
            headers: res.headers
          });
        } catch {
          resolve({
            status: res.statusCode,
            body: data,
            headers: res.headers
          });
        }
      });
    });

    req.on('error', reject);
    
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
};

// Test helper
const test = async (name, testFn) => {
  try {
    await testFn();
    console.log(`✅ ${name}`);
    testsPassed++;
  } catch (error) {
    console.error(`❌ ${name}`);
    console.error(`   Error: ${error.message}`);
    testsFailed++;
  }
};

// Run tests
const runTests = async () => {
  console.log('🧪 Starting API Tests...\n');

  // Test 1: Health Check
  await test('Health Check: GET /api/health', async () => {
    const response = await makeRequest('GET', '/api/health');
    if (response.status !== 200 || !response.body.status) {
      throw new Error(`Expected status 200, got ${response.status}`);
    }
  });

  // Test 2: Get Paint Types
  await test('Paint Types: GET /api/paint-types', async () => {
    const response = await makeRequest('GET', '/api/paint-types');
    if (response.status !== 200 || !Array.isArray(response.body)) {
      throw new Error(`Expected status 200 with array, got ${response.status}`);
    }
  });

  // Test 3: Create Paint Type
  let paintTypeId = null;
  await test('Paint Types: POST /api/paint-types', async () => {
    const response = await makeRequest('POST', '/api/paint-types', {
      name: 'Test Paint Type ' + Date.now()
    });
    if (response.status !== 201 || !response.body._id) {
      throw new Error(`Expected status 201 with created type, got ${response.status}`);
    }
    paintTypeId = response.body._id;
  });

  // Test 4: Get Products
  await test('Products: GET /api/products', async () => {
    const response = await makeRequest('GET', '/api/products');
    if (response.status !== 200 || !Array.isArray(response.body)) {
      throw new Error(`Expected status 200 with array, got ${response.status}`);
    }
  });

  // Test 5: Create Product
  let productId = null;
  await test('Products: POST /api/products', async () => {
    const response = await makeRequest('POST', '/api/products', {
      productName: 'Test Product ' + Date.now(),
      brand: 'Test Brand',
      paintType: 'Acrylic',
      quantity: '5L',
      expiryDate: '2025-12-31'
    });
    if (response.status !== 201 || !response.body._id) {
      throw new Error(`Expected status 201 with created product, got ${response.status}`);
    }
    productId = response.body._id;
  });

  // Test 6: Get Product by ID
  if (productId) {
    await test('Products: GET /api/products/:id', async () => {
      const response = await makeRequest('GET', `/api/products/${productId}`);
      if (response.status !== 200 || !response.body._id) {
        throw new Error(`Expected status 200 with product, got ${response.status}`);
      }
    });
  }

  // Test 7: Update Product
  if (productId) {
    await test('Products: PUT /api/products/:id', async () => {
      const response = await makeRequest('PUT', `/api/products/${productId}`, {
        productName: 'Updated Product ' + Date.now(),
        brand: 'Updated Brand',
        paintType: 'Enamel',
        quantity: '10L',
        expiryDate: '2026-12-31'
      });
      if (response.status !== 200 || !response.body._id) {
        throw new Error(`Expected status 200 with updated product, got ${response.status}`);
      }
    });
  }

  // Test 8: Save QR Code
  if (productId) {
    await test('Products: POST /api/products/:id/qr', async () => {
      const response = await makeRequest('POST', `/api/products/${productId}/qr`, {
        qrCodeData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
      });
      if (response.status !== 200 || !response.body.message) {
        throw new Error(`Expected status 200 with success message, got ${response.status}`);
      }
    });
  }

  // Test 9: Get Saved Paints
  await test('Saved Paints: GET /api/saved-paints', async () => {
    const response = await makeRequest('GET', '/api/saved-paints');
    if (response.status !== 200 || !Array.isArray(response.body)) {
      throw new Error(`Expected status 200 with array, got ${response.status}`);
    }
  });

  // Test 10: Create Saved Paint
  let savedPaintId = null;
  await test('Saved Paints: POST /api/saved-paints', async () => {
    const response = await makeRequest('POST', '/api/saved-paints', {
      name: 'Test Paint ' + Date.now(),
      brand: 'Test Brand',
      paintType: 'Acrylic',
      quantity: '5L',
      color: '#FF5733'
    });
    if (response.status !== 201 || !response.body._id) {
      throw new Error(`Expected status 201 with created saved paint, got ${response.status}`);
    }
    savedPaintId = response.body._id;
  });

  // Test 11: Toggle Favorite
  if (savedPaintId) {
    await test('Saved Paints: PUT /api/saved-paints/:id/favorite', async () => {
      const response = await makeRequest('PUT', `/api/saved-paints/${savedPaintId}/favorite`);
      if (response.status !== 200) {
        throw new Error(`Expected status 200, got ${response.status}`);
      }
    });
  }

  // Test 12: Delete Product
  if (productId) {
    await test('Products: DELETE /api/products/:id', async () => {
      const response = await makeRequest('DELETE', `/api/products/${productId}`);
      if (response.status !== 200 || !response.body.message) {
        throw new Error(`Expected status 200 with success message, got ${response.status}`);
      }
    });
  }

  // Test 13: Delete Saved Paint
  if (savedPaintId) {
    await test('Saved Paints: DELETE /api/saved-paints/:id', async () => {
      const response = await makeRequest('DELETE', `/api/saved-paints/${savedPaintId}`);
      if (response.status !== 200) {
        throw new Error(`Expected status 200, got ${response.status}`);
      }
    });
  }

  // Test 14: Delete Paint Type
  if (paintTypeId) {
    await test('Paint Types: DELETE /api/paint-types/:id', async () => {
      const response = await makeRequest('DELETE', `/api/paint-types/${paintTypeId}`);
      if (response.status !== 200 || !response.body.success) {
        throw new Error(`Expected status 200 with success, got ${response.status}`);
      }
    });
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log(`📊 Test Results: ${testsPassed} passed, ${testsFailed} failed`);
  console.log('='.repeat(50));

  process.exit(testsFailed > 0 ? 1 : 0);
};

// Wait for server to be ready
const checkServerReady = async () => {
  let retries = 30;
  while (retries > 0) {
    try {
      await makeRequest('GET', '/api/health');
      console.log('✅ Server is ready!\n');
      return;
    } catch {
      retries--;
      await new Promise(r => setTimeout(r, 1000));
    }
  }
  console.error('❌ Server did not start in time');
  process.exit(1);
};

checkServerReady().then(() => runTests()).catch(err => {
  console.error('❌ Test error:', err);
  process.exit(1);
});
