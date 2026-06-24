'use strict';

const path = require('node:path');
const http = require('node:http');
const { pathToFileURL } = require('node:url');
const { app, BrowserWindow, shell } = require('electron');

const appRoot = path.join(__dirname, '..');
const serverEntry = path.join(appRoot, 'server', 'index.js');
const clientDist = path.join(appRoot, 'client', 'dist');

const PORT = Number(process.env.DEALSIGHT_PORT || process.env.PORT || 5000);
const BASE_URL = `http://localhost:${PORT}`;

// Configure the bundled API server before it is imported. dotenv does not
// override variables that are already present, so these win in the packaged app.
process.env.PORT = String(PORT);
process.env.SERVE_CLIENT = '1';
process.env.CLIENT_DIST = clientDist;
process.env.CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || BASE_URL;
process.env.DATABASE_URL =
  process.env.DATABASE_URL || 'postgres://user:password@localhost:5432/dealsight';

let mainWindow = null;

async function startServer() {
  // The API is an ES module; load it from the CommonJS main process.
  await import(pathToFileURL(serverEntry).href);
}

function waitForServer(timeoutMs = 20000) {
  const deadline = Date.now() + timeoutMs;
  return new Promise((resolve, reject) => {
    const attempt = () => {
      const req = http.get(`${BASE_URL}/api/health`, (res) => {
        res.resume();
        if (res.statusCode === 200) {
          resolve();
        } else {
          retry();
        }
      });
      req.on('error', retry);
      req.setTimeout(1500, () => req.destroy());
    };
    const retry = () => {
      if (Date.now() > deadline) {
        reject(new Error('Timed out waiting for the DealSight API to start.'));
      } else {
        setTimeout(attempt, 300);
      }
    };
    attempt();
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    backgroundColor: '#020617',
    title: 'DealSight',
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Open external links in the user's default browser, not inside the app.
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (!url.startsWith(BASE_URL)) {
      shell.openExternal(url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });

  mainWindow.loadURL(BASE_URL);
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(async () => {
  try {
    await startServer();
    await waitForServer();
  } catch (error) {
    console.error('Failed to start DealSight backend:', error);
  }
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
