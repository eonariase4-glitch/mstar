import dotenv from 'dotenv';
import { app as electronApp, BrowserWindow, ipcMain } from 'electron';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createApp } from '../server/app.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isDev = !electronApp.isPackaged;

let apiServer;
let apiBaseUrl;

const startEmbeddedApi = () =>
  new Promise((resolve, reject) => {
    const server = createApp().listen(0, '127.0.0.1');

    server.once('listening', () => {
      const address = server.address();
      apiServer = server;
      apiBaseUrl = `http://127.0.0.1:${address.port}/api`;
      resolve(apiBaseUrl);
    });

    server.once('error', reject);
  });

const createWindow = async () => {
  await startEmbeddedApi();

  const window = new BrowserWindow({
    width: 1440,
    height: 960,
    minWidth: 1100,
    minHeight: 720,
    title: 'DealSight',
    backgroundColor: '#020617',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.cjs'),
      additionalArguments: [`--dealsight-api-base-url=${apiBaseUrl}`],
    },
  });

  if (isDev && process.env.VITE_DEV_SERVER_URL) {
    await window.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    await window.loadFile(path.join(__dirname, '../client/dist/index.html'));
  }
};

ipcMain.handle('dealsight:get-api-base-url', () => apiBaseUrl);

electronApp.whenReady().then(createWindow);

electronApp.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    electronApp.quit();
  }
});

electronApp.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

electronApp.on('before-quit', () => {
  apiServer?.close();
});
