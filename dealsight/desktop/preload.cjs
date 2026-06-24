const { contextBridge, ipcRenderer } = require('electron');

const apiArg = process.argv.find((arg) => arg.startsWith('--dealsight-api-base-url='));
const apiBaseUrl = apiArg?.split('=')[1];

contextBridge.exposeInMainWorld('DEALSIGHT_DESKTOP', true);
contextBridge.exposeInMainWorld('DEALSIGHT_CONFIG', {
  apiBaseUrl,
  getApiBaseUrl: () => ipcRenderer.invoke('dealsight:get-api-base-url'),
});
