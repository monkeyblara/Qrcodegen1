# Installation & Setup Checklist

## Pre-Installation Requirements

- [ ] Windows/Mac/Linux computer
- [ ] Internet connection (for npm packages)
- [ ] ~2GB free disk space (for node_modules)
- [ ] 15 minutes of time

---

## Step 1: Install Node.js

### On Windows:
1. [ ] Visit https://nodejs.org/
2. [ ] Download LTS version (recommended)
3. [ ] Run installer
4. [ ] Check "Add to PATH"
5. [ ] Complete installation
6. [ ] Restart computer

### On Mac:
1. [ ] Visit https://nodejs.org/ 
2. [ ] Download LTS version
3. [ ] Run .pkg installer
4. [ ] Follow installation wizard
5. [ ] Restart computer

### On Linux (Ubuntu/Debian):
```bash
[ ] sudo apt update
[ ] sudo apt install nodejs npm
```

### Verify Installation:
```bash
[ ] node --version    (should show v14 or higher)
[ ] npm --version     (should show v6 or higher)
```

---

## Step 2: Download Project

- [ ] Navigate to: `c:\Users\Lenovo\Documents\QR CODE GENERATOR SYSTEM`
- [ ] Verify folder exists
- [ ] Open terminal/command prompt in this folder

---

## Step 3: Run Setup Script

### Windows Users:
1. [ ] Right-click in folder → "Open command prompt here"
   - OR -
   [ ] Click address bar, type `cmd`, press Enter

2. [ ] Run: `setup.bat`
3. [ ] Wait for installation to complete
4. [ ] Should see: "✅ Setup complete!"

### Mac/Linux Users:
1. [ ] Open terminal
2. [ ] Navigate: `cd c:\Users\Lenovo\Documents\QR\ CODE\ GENERATOR\ SYSTEM`
3. [ ] Run: `bash setup.sh`
4. [ ] Wait for installation
5. [ ] Should see: "✅ Setup complete!"

### What Gets Installed:
- [ ] Root dependencies (Express, SQLite, etc.)
- [ ] Client dependencies (React, etc.)
- [ ] Database initialization code

---

## Step 4: Verify Installation

### Check Node Modules:
```bash
[ ] ls node_modules          (Mac/Linux)
[ ] dir node_modules         (Windows)
```
Should see: express, sqlite3, uuid, etc.

### Check Client Dependencies:
```bash
[ ] ls client/node_modules   (Mac/Linux)
[ ] dir client\node_modules  (Windows)
```
Should see: react, react-dom, etc.

---

## Step 5: Start Application

In the project root, run:
```bash
[ ] npm run dev
```

### Expected Output:
```
√ Frontend running on http://localhost:3000
√ Backend running on http://localhost:5000
√ Database initialized
```

### Auto-Actions:
- [ ] Frontend browser tab opens automatically
- [ ] Backend server starts in background
- [ ] You should see login page ready

---

## Step 6: Verify Everything Works

### Frontend Check:
1. [ ] Browser opens http://localhost:3000
2. [ ] You see "Paint QR Code Generator System" header
3. [ ] "+ Add New Product" button visible
4. [ ] Product list area visible
5. [ ] Right panel visible (empty initially)

### Backend Check:
1. [ ] Terminal shows: "Server running on http://localhost:5000"
2. [ ] Terminal shows: "Database initialized"

### Database Check:
1. [ ] File created: `server/qr_paint.db`

---

## Step 7: Test Core Functionality

### Create Test Product:
1. [ ] Click "+ Add New Product"
2. [ ] Fill in details:
   - [ ] Product Name: "Test Paint"
   - [ ] Brand: "Test Brand"
   - [ ] Paint Type: Select any
   - [ ] Quantity: "5L"
   - [ ] Expiry Date: Pick future date
3. [ ] Click "Add Product"
4. [ ] Product appears in list
5. [ ] Serial number auto-generated (SN-xxxxx)

### View Product Details:
1. [ ] Click on product in list
2. [ ] Details show on right panel
3. [ ] Serial number displays
4. [ ] All product info shows

### Generate QR Code:
1. [ ] QR code appears on right panel
2. [ ] QR code is visible/clear
3. [ ] Code contains product info

### Download QR Code:
1. [ ] Click "📥 Download PNG"
2. [ ] File downloads successfully
3. [ ] Filename: `SN-xxxxx.png`
4. [ ] Can repeat with JPG

### Print QR Code:
1. [ ] Click "🖨️ Print"
2. [ ] Print dialog opens
3. [ ] Print preview shows QR + details
4. [ ] Can print or save as PDF

### Edit Product:
1. [ ] Click "✏️ Edit" on product
2. [ ] Form shows current values
3. [ ] Change a value (e.g., quantity)
4. [ ] Click "Update Product"
5. [ ] Changes saved successfully

### Delete Product:
1. [ ] Click "🗑️ Delete" on product
2. [ ] Confirmation dialog appears
3. [ ] Confirm deletion
4. [ ] Product removed from list

---

## Step 8: Verify Database

### Check SQLite Database:
```bash
[ ] sqlite3 server/qr_paint.db
[ ] .tables
[ ] SELECT * FROM products;
[ ] .exit
```

Should show:
- [ ] products table exists
- [ ] Your test product in table
- [ ] All columns created

---

## Step 9: Test QR Scanning (Optional)

### Setup:
1. [ ] Find your computer's IP:
   - Windows: `ipconfig` (look for IPv4)
   - Mac/Linux: `ifconfig` (look for inet)
   Example: `192.168.1.100`

2. [ ] On same WiFi network

### Scan:
1. [ ] Use smartphone camera on QR code
2. [ ] Tap link in notification
3. [ ] Should open: `http://{your-ip}:3000/product/{id}`
4. [ ] Product details display on phone
5. [ ] All info readable on mobile

---

## Step 10: Environment Setup (Optional)

### Create .env file:
```bash
[ ] Copy .env.example to .env
[ ] Edit .env with custom values (optional)
[ ] Settings:
    - [ ] PORT=5000
    - [ ] NODE_ENV=development
    - [ ] REACT_APP_API_URL=http://localhost:5000
```

---

## Troubleshooting During Setup

### Issue: "npm command not found"
- [ ] Install Node.js again
- [ ] Add to PATH during installation
- [ ] Restart computer

### Issue: Port 5000 or 3000 in use
- [ ] Kill the process using port
- [ ] Change port in server/index.js
- [ ] Restart npm run dev

### Issue: Installation hangs
- [ ] Press Ctrl+C to cancel
- [ ] Delete node_modules folder
- [ ] Run npm install again

### Issue: Database error
- [ ] Delete server/qr_paint.db
- [ ] Restart application
- [ ] Database will recreate

### Issue: React not loading
- [ ] Hard refresh: Ctrl+Shift+R
- [ ] Clear browser cache
- [ ] Check console (F12) for errors

---

## Post-Installation Verification

- [ ] npm run dev starts without errors
- [ ] Frontend loads at localhost:3000
- [ ] Backend runs at localhost:5000
- [ ] Can create product
- [ ] QR code generates
- [ ] Can download QR
- [ ] Can edit product
- [ ] Can delete product
- [ ] Database file exists: server/qr_paint.db

---

## Success Criteria ✅

Your setup is complete when:

- ✅ npm run dev works
- ✅ http://localhost:3000 loads
- ✅ You can create a product
- ✅ QR code generates
- ✅ Database stores data
- ✅ No error messages
- ✅ All features work

---

## Next Steps

### If Everything Works:
1. [ ] Read QUICKSTART.md for quick guide
2. [ ] Read README.md for full documentation
3. [ ] Start using the system
4. [ ] Create actual products
5. [ ] Download QR codes
6. [ ] Print and attach to products

### If Issues Occur:
1. [ ] Check FAQ.md for common issues
2. [ ] Verify all installation steps
3. [ ] Check terminal output for errors
4. [ ] Try fresh installation if needed

---

## System Requirements Summary

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| OS | Windows/Mac/Linux | Windows 10+, Mac OS 10.14+, Ubuntu 18.04+ |
| Node.js | v14 | v18+ |
| npm | v6 | v8+ |
| RAM | 2GB | 4GB+ |
| Disk | 2GB | 5GB+ |
| Browser | Any modern | Chrome, Firefox, Safari |

---

## Completion Checklist

- [ ] Node.js installed
- [ ] setup.bat/setup.sh run successfully
- [ ] npm run dev works
- [ ] Frontend loads
- [ ] Backend runs
- [ ] Database created
- [ ] Test product created
- [ ] QR code generated
- [ ] QR code downloaded
- [ ] Product edited
- [ ] Product deleted
- [ ] All tests passed ✅

---

## Congratulations! 🎉

Your Paint QR Code Generator System is installed and ready to use!

### Quick Commands to Remember:
```bash
npm run dev          # Start everything
npm run server       # Backend only
npm run client       # Frontend only
npm run build        # Production build
```

### Important Folders:
- `server/` - Backend code
- `client/src/` - Frontend code
- `server/qr_paint.db` - Database file

### Useful Links:
- http://localhost:3000 - Frontend
- http://localhost:5000/api/products - API
- Documentation: README.md

---

**Setup Date**: June 2, 2026
**Status**: Ready for Use ✅

Enjoy your QR Code Generator System! 🎨
