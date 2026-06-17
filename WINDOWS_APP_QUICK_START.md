# 🚀 Quick Start - Windows Desktop App

Get the Paint QR Generator running as a Windows desktop application in 5 minutes!

## ⚡ Ultra-Quick Start

### Option 1: Automated Build (Easiest)

1. **Double-click** `BUILD_WINDOWS_APP.bat`
   - Installs dependencies
   - Builds the app
   - Creates installer automatically

2. **Wait for completion** (5-10 minutes)

3. **Find your installer** in the `dist` folder
   - Run `Paint QR Generator Setup 1.0.0.exe`
   - Or use portable version `Paint QR Generator 1.0.0.exe`

4. **Done!** App is ready to use

---

### Option 2: PowerShell Build

```powershell
# Right-click PowerShell and run as Administrator
.\BUILD_WINDOWS_APP.ps1
```

---

### Option 3: Manual Build (For Developers)

```powershell
# Install dependencies
npm install

# Build frontend
npm run build

# Create installer
npm run electron-build
```

---

## 🔧 Configuration (First Time Only)

1. **Create `.env` file** from `.env.example`:
   ```
   MONGODB_URI=mongodb://localhost:27017/qr-paint-system
   PORT=3000
   NODE_ENV=production
   JWT_SECRET=your-secret-key-here
   ```

2. **Ensure MongoDB is running**:
   ```powershell
   # If MongoDB is installed locally
   mongod
   ```

---

## 🎯 What Gets Created

In the `dist` folder after building:

| File | Purpose |
|------|---------|
| `Paint QR Generator Setup 1.0.0.exe` | Full installer (~150MB) |
| `Paint QR Generator 1.0.0.exe` | Portable single-file app (~200MB) |

---

## 📋 System Requirements

✅ Windows 10 or newer
✅ 2GB RAM minimum
✅ 500MB disk space
✅ MongoDB (local or cloud)
✅ .NET Framework 4.7.2+ (usually pre-installed)

---

## 🔄 Development Mode

For making changes and testing:

```powershell
npm run electron-dev
```

This:
- Starts backend server
- Starts React dev server with hot reload
- Opens Electron with DevTools
- Auto-reloads on code changes

---

## 🆘 Troubleshooting

### "MongoDB connection failed"
```powershell
# Make sure MongoDB is running
# For local MongoDB:
mongod

# Or update .env to use MongoDB Atlas:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/db
```

### "Port 3000 already in use"
```
# Update .env
PORT=3001
```

### "Build takes too long"
- First build takes 5-10 minutes (normal)
- Subsequent builds are faster
- Ensure you have 5GB free disk space

### "Installer won't run"
- Run as Administrator
- Disable antivirus temporarily (some block installers)
- Restart computer after installation

---

## 📦 Distribution

### Share with Users:
1. Upload `Paint QR Generator Setup 1.0.0.exe` to your server
2. Users download and run it
3. App automatically installs to Program Files

### Auto-Update Feature:
To add auto-updates, see `WINDOWS_APP_BUILD_GUIDE.md`

---

## 🆕 Version Updates

When you update the app:

1. Update version in `package.json`:
   ```json
   "version": "1.0.1"
   ```

2. Rebuild:
   ```powershell
   npm run electron-build
   ```

3. New installer will be created with new version number

---

## ✅ Features Included

- ✅ All product management features
- ✅ QR code generation & download
- ✅ User authentication
- ✅ Database synchronization
- ✅ Paint type management
- ✅ Chemical tracking
- ✅ Saved paints library
- ✅ Native Windows experience
- ✅ Desktop shortcuts
- ✅ Start menu integration

---

## 📞 Need Help?

1. Check `WINDOWS_APP_BUILD_GUIDE.md` for detailed info
2. See `FEATURES.md` for app capabilities
3. Review error messages in DevTools (Ctrl+Shift+I)

---

**Status**: ✅ Ready for Windows Distribution
**Created**: 2026-06-12

---
License: MIT. Copyright (c) 2026 Munashe Mudondo. All rights reserved.

