# 🖥️ Building Windows Desktop App - Paint QR Generator

This guide explains how to build and deploy the Paint QR Generator as a Windows desktop application using Electron.

## 📋 Prerequisites

- **Node.js** v18+ installed
- **MongoDB** running locally or connection string available
- **Windows 10+** for building
- **PowerShell** or Command Prompt

## 🚀 Quick Start

### 1. Install Dependencies

```powershell
# From project root
npm install
```

This will:
- Install Electron and build tools
- Install all server dependencies
- Install all client dependencies
- Build the React app

### 2. Build React Frontend

```powershell
npm run build
```

### 3. Create Windows Installer

```powershell
# Creates both NSIS installer and portable executable
npm run electron-build
```

The installers will be created in the `dist` folder:
- `Paint QR Generator Setup 1.0.0.exe` - Full installer
- `Paint QR Generator 1.0.0.exe` - Portable version (single file)

## 🔧 Development Setup

For development and testing:

```powershell
# Build React and start Electron with hot reload
npm run electron-dev
```

This will:
1. Build the React app
2. Wait for Vite dev server (port 5173)
3. Launch Electron in development mode
4. Show dev tools automatically

Or run components separately:

```powershell
# Terminal 1 - Start backend
npm run server

# Terminal 2 - Start React dev server
npm run client

# Terminal 3 - Start Electron
npm run electron
```

## 📦 Build Configuration

The build configuration is in `package.json` under the `"build"` section:

- **appId**: `com.paintqr.app`
- **productName**: `Paint QR Generator`
- **Targets**: 
  - NSIS installer (x64 & ia32)
  - Portable executable (x64)
- **Start Menu & Desktop Shortcuts**: Created automatically

## 🔐 Environment Variables

Create a `.env` file in the project root:

```env
MONGODB_URI=mongodb://localhost:27017/qr-paint-system
PORT=3000
NODE_ENV=production
JWT_SECRET=your_secret_key_here
```

The Electron app will automatically set:
- `PORT=3000` (if not set)
- `MONGODB_URI=mongodb://localhost:27017/qr-paint-system` (if not set)

## 📁 Project Structure for Electron

```
project-root/
├── public/
│   ├── main.js          # Electron main process
│   └── preload.js       # Secure IPC bridge
├── server/              # Express backend
│   ├── index.js
│   └── routes/
├── client/              # React frontend
│   ├── src/
│   └── dist/            # Build output
├── assets/
│   └── icon.ico         # App icon (optional)
└── package.json
```

## 🎨 Adding App Icon

To add a custom Windows icon:

1. Create an icon file: `assets/icon.ico` (256x256px minimum)
2. The app will automatically use it in the window and installer

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check `MONGODB_URI` in `.env`
- The app will try local MongoDB by default

### Port Already in Use
- The app uses port 3000 by default
- Change in `.env`: `PORT=3001`

### Build Fails - Missing Dependencies
```powershell
# Clean install
rm -r node_modules
npm install
npm run build
npm run electron-build
```

### Installer Won't Start
- Uninstall existing version first
- Run installer as Administrator
- Check Windows Defender/Antivirus isn't blocking

## 📊 Features in Desktop App

✅ All web features work in desktop mode:
- Product management with QR generation
- Database synchronization
- User authentication
- File downloads/printing
- Responsive UI

✅ Desktop-specific features:
- Native app menu
- Start menu integration
- Desktop shortcuts
- Native window controls
- Offline support (with local data)

## 🚀 Distribution

### Option 1: Direct Distribution
- Share `Paint QR Generator Setup 1.0.0.exe` with users
- Users run installer and launch from Start Menu

### Option 2: Self-Update (Advanced)
- Host releases on GitHub/server
- Configure electron-updater for auto-updates
- Edit `package.json` build section

### Option 3: Deployment Script
Users can run:
```powershell
# Download and auto-run installer
powershell -Command "(New-Object System.Net.WebClient).DownloadFile('https://your-server/installer.exe', 'Paint-QR-Installer.exe'); & 'Paint-QR-Installer.exe'"
```

## 📝 Version Updates

Update version in `package.json`:
```json
"version": "1.0.1"
```

Rebuild the installer:
```powershell
npm run electron-build
```

## 🔗 Useful Commands Summary

| Command | Purpose |
|---------|---------|
| `npm install` | Install all dependencies |
| `npm run build` | Build React frontend |
| `npm run electron` | Run Electron in production mode |
| `npm run electron-dev` | Run Electron in development |
| `npm run electron-build` | Create Windows installer |
| `npm run server` | Start Express backend only |
| `npm run client` | Start React dev server only |

## ⚙️ Advanced Configuration

### Custom Installer Settings

Edit `package.json` build.nsis section:
- `oneClick: false` - Show directory selection
- `allowToChangeInstallationDirectory: true` - Let users choose install location
- `createDesktopShortcut: true` - Create desktop shortcut
- `createStartMenuShortcut: true` - Add to Start Menu

### Code Signing (For Production)

For production distribution, add code signing:
```json
"certificateFile": "path/to/certificate.pfx",
"certificatePassword": "password"
```

## 📞 Support

For issues or questions:
1. Check MongoDB is running
2. Review logs in Console (DevTools)
3. Check `.env` configuration
4. Review error messages carefully

---

**Created**: 2026-06-12
**Status**: Ready for Windows Distribution
