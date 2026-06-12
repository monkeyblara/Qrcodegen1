const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

let mainWindow;
let serverProcess;

// Check if running in development
const isDev = process.env.ELECTRON_DEV === 'true' || process.argv.includes('--dev');

// Handle creating/removing shortcuts on Windows when installing/uninstalling
let squirrelStartup = false;
try {
  squirrelStartup = require('electron-squirrel-startup');
} catch (error) {
  squirrelStartup = false;
}
if (squirrelStartup) {
  app.quit();
}

// Create the browser window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 900,
    minHeight: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    icon: path.join(__dirname, '../assets/icon.ico'),
  });

  // Load the app
  const startUrl = isDev
    ? 'http://localhost:5173'
    : `file://${path.join(__dirname, '../client/dist/index.html')}`;

  mainWindow.loadURL(startUrl);

  // Open DevTools to see errors
  // Disable in production by setting HIDE_DEV_TOOLS=true
  if (!process.env.HIDE_DEV_TOOLS) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
    // Kill the server process when app closes
    if (serverProcess) {
      serverProcess.kill();
    }
  });
}

// Start the Express server
function startServer() {
  return new Promise((resolve, reject) => {
    const serverPath = path.join(__dirname, '../server/index.js');

    // Set up environment
    const env = { ...process.env };
    if (!env.PORT) {
      env.PORT = 3000;
    }
    if (!env.MONGODB_URI) {
      // Use local MongoDB or provide a default
      env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/qr-paint-system';
    }

    serverProcess = spawn('node', [serverPath], {
      env,
      stdio: 'inherit',
    });

    serverProcess.on('error', (error) => {
      console.error('Failed to start server:', error);
      reject(error);
    });

    serverProcess.on('exit', (code) => {
      if (code !== null && code !== 0) {
        console.error(`Server exited with code ${code}`);
      }
    });

    // Give server time to start
    setTimeout(() => {
      resolve();
    }, 2000);
  });
}

// App event listeners
app.on('ready', async () => {
  try {
    // Start the server first
    await startServer();
    // Then create the window
    createWindow();
    createMenu();
  } catch (error) {
    console.error('Failed to start app:', error);
    app.quit();
  }
});

app.on('window-all-closed', () => {
  // On macOS, keep app active until user quits explicitly
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS, re-create window when dock icon is clicked
  if (mainWindow === null) {
    createWindow();
  }
});

// Create application menu
function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Exit',
          accelerator: 'CmdOrCtrl+Q',
          click: () => {
            app.quit();
          },
        },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { label: 'Undo', accelerator: 'CmdOrCtrl+Z', selector: 'undo:' },
        { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', selector: 'redo:' },
        { type: 'separator' },
        { label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
        { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
        { label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
      ],
    },
    {
      label: 'View',
      submenu: [
        { label: 'Reload', accelerator: 'CmdOrCtrl+R', click: () => mainWindow.reload() },
        {
          label: 'Toggle Developer Tools',
          accelerator: 'CmdOrCtrl+Shift+I',
          click: () => mainWindow.webContents.toggleDevTools(),
        },
      ],
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About Paint QR Generator',
          click: () => {
            // Could open an about dialog here
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// Handle IPC calls from renderer
ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

ipcMain.handle('get-app-name', () => {
  return app.getName();
});
