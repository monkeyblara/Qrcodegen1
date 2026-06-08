# Project Structure & Architecture

## Complete Directory Map

```
QR CODE GENERATOR SYSTEM/
│
├── 📁 server/                    # Backend (Node.js + Express)
│   ├── 📄 index.js              # Server initialization and middleware
│   ├── 📄 database.js           # SQLite database setup and CRUD operations
│   └── 📁 routes/
│       └── 📄 products.js       # Product API endpoints
│
├── 📁 client/                    # Frontend (React)
│   ├── 📁 public/
│   │   └── 📄 index.html        # HTML entry point
│   ├── 📁 src/
│   │   ├── 📄 App.js            # Main React component with routing
│   │   ├── 📄 App.css           # Main styling
│   │   ├── 📄 index.js          # React DOM render
│   │   └── 📁 components/
│   │       ├── ProductForm.js   # Create/Edit product form
│   │       ├── ProductForm.css  # Form styling
│   │       ├── ProductList.js   # Product listing component
│   │       ├── ProductList.css  # List styling
│   │       ├── ProductDetails.js # QR code details page
│   │       └── ProductDetails.css # Details styling
│   └── 📄 package.json          # Client dependencies
│
├── 📁 server/                    # Database (auto-created)
│   └── 📄 qr_paint.db          # SQLite database file
│
├── 📄 package.json              # Root project configuration
├── 📄 .gitignore               # Git ignore rules
├── 📄 .env.example             # Environment variables template
│
├── 📄 README.md                # Complete documentation
├── 📄 QUICKSTART.md            # Quick start guide (5 minutes)
├── 📄 FEATURES.md              # Feature documentation
├── 📄 DEPLOYMENT.md            # Deployment instructions
├── 📄 FAQ.md                   # Troubleshooting guide
├── 📄 ARCHITECTURE.md          # This file
│
├── 🔧 setup.sh                 # Linux/Mac setup script
└── 🔧 setup.bat                # Windows setup script
```

## Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite3
- **Key Libraries**:
  - `express` - Web framework
  - `sqlite3` - Database
  - `uuid` - Unique ID generation
  - `cors` - Cross-origin support
  - `body-parser` - Request parsing

### Frontend
- **Library**: React 18
- **Styling**: CSS3
- **QR Code**: react-qr-code
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **Key Libraries**:
  - `react` - UI library
  - `react-dom` - DOM rendering
  - `react-qr-code` - QR code generation
  - `axios` - API calls
  - `react-router-dom` - Navigation

### Development Tools
- **Build Tool**: react-scripts (Create React App)
- **Process Manager**: concurrently
- **Auto-reload**: nodemon
- **Version Control**: Git

## Architecture Overview

### Application Flow

```
User Browser
    ↓
React Frontend (Port 3000)
    ↓
API Requests (axios)
    ↓
Express Server (Port 5000)
    ↓
SQLite Database
    ↓
Products Table
```

### Component Hierarchy

```
App (Router)
├── AppContent
│   ├── ProductForm
│   │   └── Form inputs
│   ├── ProductList
│   │   └── Product items
│   └── QRCodeDisplay
│       └── QR Code + Actions
└── ProductDetailsPage
    └── ProductDetails
        └── Scan result page
```

## Database Schema

### Products Table

```sql
CREATE TABLE products (
  id TEXT PRIMARY KEY,                    -- UUID v4
  serialNumber TEXT UNIQUE,               -- SN-{timestamp}-{random}
  productName TEXT NOT NULL,              -- Product name
  brand TEXT NOT NULL,                    -- Brand name
  paintType TEXT NOT NULL,                -- Acrylic, Oil-based, Latex, etc.
  quantity TEXT NOT NULL,                 -- 5L, 20 Liters, etc.
  expiryDate TEXT NOT NULL,               -- ISO date format
  qrCode TEXT,                            -- Base64 encoded QR code (optional)
  createdAt TEXT,                         -- ISO timestamp
  updatedAt TEXT                          -- ISO timestamp
)
```

## API Endpoints

### Product Management

```
GET  /api/products              → Get all products
GET  /api/products/:id          → Get product by ID
POST /api/products              → Create new product
PUT  /api/products/:id          → Update product
DELETE /api/products/:id        → Delete product
POST /api/products/:id/qr       → Save QR code
GET  /product/:id               → Get product details (for QR scanning)
```

### Request/Response Examples

#### Create Product
```
POST /api/products
Content-Type: application/json

{
  "productName": "Premium Wall Paint",
  "brand": "Dulux",
  "paintType": "Acrylic",
  "quantity": "5L",
  "expiryDate": "2025-06-30"
}

Response (201):
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "serialNumber": "SN-1717319400000-ABC123XYZ",
  "productName": "Premium Wall Paint",
  "brand": "Dulux",
  "paintType": "Acrylic",
  "quantity": "5L",
  "expiryDate": "2025-06-30",
  "createdAt": "2024-06-02T10:30:00.000Z"
}
```

#### Get Product
```
GET /api/products/550e8400-e29b-41d4-a716-446655440000

Response (200):
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "serialNumber": "SN-1717319400000-ABC123XYZ",
  "productName": "Premium Wall Paint",
  "brand": "Dulux",
  "paintType": "Acrylic",
  "quantity": "5L",
  "expiryDate": "2025-06-30",
  "createdAt": "2024-06-02T10:30:00.000Z",
  "updatedAt": "2024-06-02T10:30:00.000Z"
}
```

## Data Flow Diagrams

### Adding a Product

```
User Input
    ↓
ProductForm Component
    ↓
Validate Form
    ↓
axios.post(/api/products)
    ↓
Express Route Handler
    ↓
Database: db.addProduct()
    ↓
Generate UUID & Serial Number
    ↓
Insert into SQLite
    ↓
Return Product Data
    ↓
Update Component State
    ↓
Refresh Product List
    ↓
Display in UI
```

### Scanning QR Code

```
User Scans QR Code
    ↓
Browser Opens
http://localhost:3000/product/{id}
    ↓
React Router: /product/:id
    ↓
ProductDetailsPage Component
    ↓
useParams() extracts id
    ↓
axios.get(/product/:id)
    ↓
Express Route Handler
    ↓
Database: db.getProductById()
    ↓
Query SQLite
    ↓
Return Product Data
    ↓
ProductDetails Component
    ↓
Display Product Info
```

## State Management

### Frontend State (React Hooks)

```
AppContent Component:
- products: Array<Product>        // All products from DB
- selectedProduct: Product | null  // Currently selected product
- showForm: boolean               // Show/hide form
- editingProduct: Product | null  // Product being edited

ProductForm Component:
- formData: Object                // Form field values
```

## Communication Protocol

### Client → Server
- **Method**: HTTP (REST)
- **Format**: JSON
- **Authentication**: None (default)
- **Error Handling**: HTTP status codes
- **Timeout**: Default browser timeout

### Server → Database
- **Method**: SQL
- **Connection**: sqlite3 module
- **Pool**: Single connection (SQLite)
- **Transactions**: Basic ACID support

## Performance Characteristics

### Database Performance
- **Single Record**: O(1) with UUID primary key
- **All Records**: O(n) sorting by date
- **Search**: O(n) without indexes
- **Write**: O(1) for inserts
- **Delete**: O(1) for deletion

### Frontend Performance
- **Component Render**: React Fiber reconciliation
- **QR Generation**: Client-side (no server load)
- **State Updates**: Immediate UI refresh
- **API Calls**: Debounced form submissions

## Security Architecture

### Client-Side
- Input validation in forms
- XSS prevention (React auto-escaping)
- CSRF token: Not required (stateless API)

### Server-Side
- Input validation (required fields)
- CORS enabled
- UUID for unguessable IDs
- SQL parameters (no injection risk)

### Database
- SQLite file system permissions
- No sensitive data encrypted (local use)
- Unique constraints on serial numbers

## Scalability Considerations

### Current Limitations
- Single database connection
- No clustering
- No caching layer
- No database replication

### Scaling Path
1. **Phase 1**: Database indexes for 1000+ products
2. **Phase 2**: Move to PostgreSQL for concurrency
3. **Phase 3**: Add Redis cache for popular products
4. **Phase 4**: Implement load balancing
5. **Phase 5**: Database sharding for very large scale

## Deployment Architecture

### Development
```
npm run dev
├── Frontend: http://localhost:3000
├── Backend: http://localhost:5000
└── Database: ./server/qr_paint.db
```

### Production (Docker)
```
Docker Container
├── Node.js Runtime
├── Express Server (Port 5000)
├── React Build (served by Express)
└── SQLite Database (volume mount)
```

### Production (Cloud)
```
Load Balancer
    ↓
App Servers (Multiple)
    ├── Express Instance 1
    ├── Express Instance 2
    └── Express Instance 3
    ↓
Database Server (PostgreSQL or MySQL)
    └── Replicated Database
```

## File Size Overview

```
server/
  index.js              ~2 KB
  database.js           ~3 KB
  routes/products.js    ~2 KB
Total Backend:          ~7 KB

client/src/
  App.js               ~6 KB
  components/          ~8 KB
Total Frontend Code:    ~14 KB

node_modules/          ~500 MB (after npm install)
client/build/          ~150 KB (production build)
```

## Development Workflow

### 1. Start Application
```bash
npm run dev
```

### 2. Make Changes
- Edit React components in `client/src/`
- Edit Express routes in `server/routes/`
- Edit database in `server/database.js`

### 3. Auto-Reload
- React: Auto-refresh in browser (Fast Refresh)
- Express: Auto-restart with nodemon
- Database: Changes reflected immediately

### 4. Test Changes
- Visit http://localhost:3000
- Test in browser console (F12)
- Check server console for errors

### 5. Commit Changes
```bash
git add .
git commit -m "Feature description"
git push
```

## Debugging

### Frontend Debugging
```javascript
// Browser Console (F12)
- Check for console.error()
- Check Network tab for API calls
- Check React DevTools
- Use debugger; statement
```

### Backend Debugging
```bash
# Terminal console
- Server logs printed automatically
- Check API responses with curl:
  curl http://localhost:5000/api/products
```

### Database Debugging
```bash
# SQLite CLI
sqlite3 server/qr_paint.db
SELECT * FROM products;
```

## Future Architecture Improvements

### Authentication
```
User Login
    ↓
JWT Token
    ↓
Protected Routes
```

### Real-time Updates
```
WebSocket Connection
    ↓
Shared DB Updates
    ↓
Real-time Sync
```

### Caching Layer
```
Request
    ↓
Redis Cache
    ↓
Database (if miss)
```

---

**Architecture Last Updated**: June 2, 2026
**System Status**: Production Ready
