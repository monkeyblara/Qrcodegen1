# 🎨 Paint QR Code Generator System

A comprehensive system for generating and managing QR codes for paint products. This application allows users to create products with detailed information, generate unique QR codes, and manage inventory efficiently.

## Features

✅ **Product Management**
- Create, read, update, and delete paint products
- Capture product details: name, brand, paint type, quantity, expiry date
- Auto-generated unique serial numbers

✅ **QR Code Generation**
- Generate unique QR codes for each product
- Download QR codes as PNG or JPG format
- Print QR codes directly

✅ **Mobile-Friendly**
- Scan QR codes using any device with a camera
- Responsive design works on desktop, tablet, and mobile
- Quick access to product details via QR scan

✅ **Data Management**
- Save product details to local database
- Edit product information (updates reflected in QR code)
- Delete products from inventory
- Real-time synchronization

## Project Structure

```
QR CODE GENERATOR SYSTEM/
├── server/
│   ├── index.js                 # Express server setup
│   ├── database.js              # SQLite database configuration
│   └── routes/
│       └── products.js          # Product CRUD API routes
├── client/
│   ├── public/
│   │   └── index.html           # HTML entry point
│   └── src/
│       ├── App.js               # Main React component
│       ├── App.css              # App styling
│       ├── index.js             # React DOM render
│       └── components/
│           ├── ProductForm.js   # Product creation/edit form
│           ├── ProductForm.css  # Form styling
│           ├── ProductList.js   # Product listing component
│           └── ProductList.css  # List styling
├── package.json                 # Root package configuration
└── .gitignore                   # Git ignore rules
```

## Tech Stack

- **Frontend**: React 18, HTML5, CSS3
- **Backend**: Node.js, Express.js
- **Database**: SQLite3
- **QR Code**: react-qr-code
- **HTTP Client**: Axios

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Setup Steps

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Install client dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

## Running the Application

### Development Mode (Both Client & Server)
```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend application on `http://localhost:3000`

### Production Build
```bash
npm run build
```

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `POST /api/products/:id/qr` - Save QR code for product

### Product Details
- `GET /product/:id` - View product details page (for QR scanning)

## API Request/Response Examples

### Create Product
```json
POST /api/products
{
  "productName": "Premium Wall Paint",
  "brand": "Dulux",
  "paintType": "Acrylic",
  "quantity": "5L",
  "expiryDate": "2025-06-30"
}

Response:
{
  "id": "uuid-string",
  "serialNumber": "SN-1717319400000-ABC123XYZ",
  "productName": "Premium Wall Paint",
  "brand": "Dulux",
  "paintType": "Acrylic",
  "quantity": "5L",
  "expiryDate": "2025-06-30",
  "createdAt": "2024-06-02T10:30:00.000Z"
}
```

### Get All Products
```json
GET /api/products

Response:
[
  {
    "id": "uuid-1",
    "serialNumber": "SN-1717319400000-ABC123XYZ",
    "productName": "Premium Wall Paint",
    "brand": "Dulux",
    "paintType": "Acrylic",
    "quantity": "5L",
    "expiryDate": "2025-06-30",
    "createdAt": "2024-06-02T10:30:00.000Z",
    "updatedAt": "2024-06-02T10:30:00.000Z"
  }
]
```

## How to Use

### Adding a Product
1. Click **"+ Add New Product"** button
2. Fill in all product details:
   - Product Name
   - Brand
   - Paint Type (dropdown: Acrylic, Oil-based, Latex, Enamel, Primer, Polyurethane)
   - Quantity
   - Expiry Date
3. Click **"Add Product"** button
4. Product appears in the list with auto-generated serial number

### Generating QR Code
1. Click on any product in the list to view details
2. View the generated QR code on the right panel
3. The QR code links to: `http://localhost:3000/product/{product-id}`

### Downloading QR Code
1. Select a product
2. Click **"📥 Download PNG"** or **"📥 Download JPG"**
3. QR code saves with filename: `{SerialNumber}.{format}`

### Printing QR Code
1. Select a product
2. Click **"🖨️ Print"** button
3. Print dialog opens with QR code and product info
4. Print to paper or PDF

### Editing Product
1. Click the **"✏️ Edit"** button on any product
2. Modify the details
3. Click **"Update Product"** to save changes
4. QR code automatically updates

### Deleting Product
1. Click the **"🗑️ Delete"** button on any product
2. Confirm deletion
3. Product is removed from database

## Scanning QR Codes

Users can scan generated QR codes using:
- Smartphone cameras (iOS/Android)
- QR code scanner apps
- Dedicated barcode scanners
- Tablets with cameras

When scanned, the QR code directs to the product details page showing:
- Serial Number
- Product Name
- Brand
- Paint Type
- Quantity
- Expiry Date

## Database

The application uses SQLite which creates a `qr_paint.db` file in the server directory. 

**Table Structure:**
```sql
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  serialNumber TEXT UNIQUE,
  productName TEXT NOT NULL,
  brand TEXT NOT NULL,
  paintType TEXT NOT NULL,
  quantity TEXT NOT NULL,
  expiryDate TEXT NOT NULL,
  qrCode TEXT,
  createdAt TEXT,
  updatedAt TEXT
)
```

## Features Implemented

1. ✅ Generate unique QR codes
2. ✅ Create product capturing name, brand, type, quantity, expiry date
3. ✅ Generate serial numbers with QR code
4. ✅ Redirect to product details page when QR is scanned
5. ✅ Scan QR codes from any device with camera
6. ✅ Save product details in database
7. ✅ Edit, delete, update product information
8. ✅ Download QR as PNG/JPG
9. ✅ Print QR codes

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### Port Already in Use
If port 5000 or 3000 is already in use, you can change them:
- Server: Modify `PORT` in `server/index.js`
- Client: Use `PORT=3001 npm start` in client directory

### Database Issues
Delete `server/qr_paint.db` to reset the database

### Dependencies Not Installing
```bash
rm -rf node_modules package-lock.json
npm install
```

## Future Enhancements

- User authentication and authorization
- Multiple warehouse support
- Inventory tracking and analytics
- Batch QR code generation
- Cloud sync and backup
- Mobile app (React Native)
- Advanced search and filtering
- Export to Excel/CSV
- Email notifications for expiring products
- Barcode support in addition to QR codes

## License

MIT License - Feel free to use this project for personal or commercial purposes.

## Support

For issues or questions, please create an issue in the project repository.

---

**Created**: June 2, 2026  
**Version**: 1.0.0  
**Status**: Production Ready
