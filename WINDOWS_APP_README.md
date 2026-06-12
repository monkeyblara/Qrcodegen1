# Paint QR Generator - Windows Desktop App

Your QR Code Generator System is now packaged as a Windows Desktop Application using Electron!

## Quick Start

### 1. Launch the App (if already built)

**Option A: Using Batch Script (Recommended for Windows)**
```cmd
LAUNCH_APP.bat
```

**Option B: Using PowerShell**
```powershell
.\LAUNCH_APP.ps1
```

**Option C: Direct Command**
```cmd
npm start
```

Or navigate to:
```
dist/packaged/Paint QR Generator-win32-x64/Paint QR Generator.exe
```

---

## Building the App from Source

If you need to rebuild the Windows app from your source code, follow these steps:

### 1. Install Dependencies (one-time)
```cmd
npm install
cd client
npm install
cd ..
```

### 2. Build and Package the App
```cmd
npm run package-with-icon
```

This command will:
- ✅ Generate app icons (PNG and ICO formats)
- ✅ Build the React frontend
- ✅ Package everything with Electron
- ✅ Create the Windows executable
- ⏱️ Takes 1-2 minutes

The packaged app will be created at:
```
dist/packaged/Paint QR Generator-win32-x64/
```

---

## Available Scripts

```bash
# Development - Run frontend + backend with hot reload
npm run dev

# Build frontend only
npm run build

# Generate app icons
npm run generate-icon

# Package app for Windows
npm run electron-package

# Package app + generate icons
npm run package-with-icon

# Run Electron in dev mode
npm run electron

# Run Electron + watch frontend changes
npm run electron-dev
```

---

## App Features

The packaged Windows app includes:

✅ **Complete System** - Frontend, backend, and database client bundled together
✅ **No Installation Required** - Portable executable, just run the `.exe`
✅ **Custom Icon** - Paint product themed application icon
✅ **Offline Ready** - Works locally with MongoDB connection
✅ **System Menu** - File, Edit, View, Help menus with standard shortcuts
✅ **Developer Tools** - Ctrl+Shift+I to access console (can be disabled for production)

---

## System Architecture

### Frontend (React)
- **Location:** `client/src/`
- **Built to:** `client/dist/`
- **Tech:** Vite, React

### Backend (Express + MongoDB)
- **Location:** `server/`
- **Database:** MongoDB (local or cloud)
- **Port:** 3000 (internal to the app)

### Desktop Wrapper (Electron)
- **Main Process:** `public/main.js`
- **Preload:** `public/preload.js`
- **Configuration:** `.electronignore`

---

## Troubleshooting

### App shows blank screen
- Frontend not building correctly. Try: `npm run build`
- Clear app cache: Delete `dist/packaged` and rebuild with `npm run package-with-icon`

### App crashes on start
- Check server logs: Look for MongoDB connection errors
- Ensure MongoDB is running if not using cloud connection
- Verify `server/index.js` environment variables

### MongoDB connection errors
- Ensure MongoDB is running on `localhost:27017` OR
- Set `MONGODB_URI` environment variable to your MongoDB connection string

### Can't delete or overwrite app
- Close the app: `taskkill /F /IM "Paint QR Generator.exe"`
- Wait 2-3 seconds
- Try packaging again

---

## Packaging Details

### What's Included
- ✅ `public/main.js` - Electron main process
- ✅ `public/preload.js` - IPC preload script
- ✅ `server/` - Backend Express app
- ✅ `client/dist/` - Built React frontend
- ✅ `node_modules/` - Production dependencies only
- ✅ `assets/icon.ico` - Application icon
- ✅ `package.json` - App configuration

### What's Excluded
- ❌ Development files (`client/src`, `client/public`)
- ❌ Build scripts and docs
- ❌ Dev dependencies
- ❌ `.git` and version control

### Ignore Rules
Configure `.electronignore` to customize what files are packaged.

---

## Next Steps

1. **Test the app:**
   ```cmd
   LAUNCH_APP.bat
   ```

2. **Create an installer (optional):**
   - Use NSIS or another installer framework
   - Point to `dist/packaged/Paint QR Generator-win32-x64/`

3. **Distribute:**
   - Zip the `dist/packaged/Paint QR Generator-win32-x64/` folder
   - Or create an installer MSI/EXE
   - Users can run directly without Node.js installed

---

## Support

For issues with:
- **Electron packaging:** Check `.electronignore` and `package.json` scripts
- **Frontend rendering:** Run `npm run dev` and check browser console
- **Backend server:** Check `server/index.js` and environment variables
- **MongoDB:** Verify connection string and server availability

---

**App built on:** Electron, React, Express, MongoDB  
**Platform:** Windows (x64)  
**Version:** 1.0.0
