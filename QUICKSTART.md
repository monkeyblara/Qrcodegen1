# Quick Start Guide - Paint QR Code Generator System

## ⚡ 5-Minute Setup

### Prerequisites
- Node.js (v14+) - [Download](https://nodejs.org/)
- 5 minutes of your time

### Step 1: Navigate to Project Directory
```bash
cd "c:\Users\Lenovo\Documents\QR CODE GENERATOR SYSTEM"
```

### Step 2: Run Setup (Windows)
```bash
setup.bat
```

Or for Mac/Linux:
```bash
bash setup.sh
```

### Step 3: Start the Application
```bash
npm run dev
```

**Automatic Startup:**
- Frontend opens automatically at `http://localhost:3000`
- Backend API runs at `http://localhost:5000`

---

## 🎯 First Steps

### Create Your First Product
1. Click **"+ Add New Product"** button
2. Fill in the details:
   - **Product Name**: e.g., "Premium Wall Paint"
   - **Brand**: e.g., "Dulux"
   - **Paint Type**: Select from dropdown
   - **Quantity**: e.g., "5L"
   - **Expiry Date**: Pick a date
3. Click **"Add Product"**
4. Product appears in the list with auto-generated Serial Number

### Generate & Download QR Code
1. Click your product in the list
2. View QR code on the right side
3. Click **"📥 Download PNG"** or **"📥 Download JPG"**
4. QR code downloads to your device

### Print QR Code
1. Select a product
2. Click **"🖨️ Print"**
3. Configure printer settings
4. Print to paper or PDF

### Scan QR Code
1. Use smartphone camera
2. Point at QR code
3. Tap notification to view details
4. Or use any QR code scanner app

---

## 📱 Testing with Your Phone

### Get the QR Code Testing Link
- Scanner will redirect to: `http://localhost:3000/product/{id}`
- **On same WiFi**: Replace `localhost` with your computer's IP address
- Find IP: Run `ipconfig` (Windows) or `ifconfig` (Mac/Linux)

### Example
```
If your IP is: 192.168.1.100
Update QR link to: http://192.168.1.100:3000/product/{id}
```

---

## 🛠️ Common Tasks

### Edit a Product
1. Find product in list
2. Click **"✏️ Edit"**
3. Modify details
4. Click **"Update Product"**
5. Done! (QR code auto-updates)

### Delete a Product
1. Click **"🗑️ Delete"**
2. Confirm deletion
3. Product removed

### View All Products
- All products show in the left panel
- Click any product to view details and QR code
- Shows creation/update dates

---

## 📊 Understanding the Interface

### Left Panel
- **+ Add New Product**: Create new product
- **Product Form**: Add/Edit product details
- **Product List**: All your products
- **Actions**: Edit or Delete each product

### Right Panel
- **Product Details**: Current product info
- **QR Code**: Scan-able code
- **Download Options**: PNG or JPG format
- **Print Button**: Print to paper or PDF

---

## 🔧 Troubleshooting

### "Port Already in Use"
```bash
# Windows: Find and kill the process
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux: Find and kill
lsof -i :5000
kill -9 <PID>
```

### "npm command not found"
- Install Node.js from https://nodejs.org/
- Restart terminal after installation

### Application Won't Start
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
cd client && npm install && cd ..
npm run dev
```

### Database Issues
```bash
# Reset database
rm server/qr_paint.db
npm run dev
```

---

## 📚 What's Next?

### Explore Advanced Features
- [Read Full Features Documentation](FEATURES.md)
- [Deployment Options](DEPLOYMENT.md)
- [Complete README](README.md)

### Customization Ideas
- Change colors in `client/src/App.css`
- Add more paint types in `ProductForm.js`
- Customize product fields in database
- Add authentication and multi-user support

### Export Your Data
```bash
# Export to CSV
sqlite3 server/qr_paint.db "SELECT * FROM products" > products.csv

# Backup database
cp server/qr_paint.db server/qr_paint.db.backup
```

---

## ✅ Feature Checklist

- ✅ Create products with details
- ✅ Generate unique QR codes
- ✅ Get auto serial numbers
- ✅ Download QR as PNG/JPG
- ✅ Print QR codes
- ✅ Scan with any device
- ✅ Edit product info
- ✅ Delete products
- ✅ View expiry status
- ✅ Mobile responsive

---

## 🆘 Need Help?

### Documentation
- [README.md](README.md) - Complete documentation
- [FEATURES.md](FEATURES.md) - Feature details
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment guide

### Common Issues
Check the [Troubleshooting section in README.md](README.md#troubleshooting)

### Development
- Edit files and save
- Frontend auto-refreshes
- Backend auto-restarts (with nodemon)

---

## 📞 Quick Reference

| Action | Command |
|--------|---------|
| Start App | `npm run dev` |
| Start Server Only | `npm run server` |
| Start Client Only | `npm run client` |
| Build for Production | `npm run build` |
| Access Frontend | `http://localhost:3000` |
| Access Backend | `http://localhost:5000` |

---

**Ready to start?** Run `npm run dev` and create your first product! 🎨

For detailed documentation, see [README.md](README.md)
