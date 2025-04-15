const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('processBridge', {
  getUsername: () => ipcRenderer.invoke('getUsername'),
  getAiName: () => ipcRenderer.invoke('getAiName'),
  getUserPfp: () => ipcRenderer.invoke('getUserPfp'),
  getAiPfp: () => ipcRenderer.invoke('getAiPfp'),
  getTheme: () => ipcRenderer.invoke('getTheme'),

  saveSettings: (settings)=> {
    ipcRenderer.send('saveSettings',settings)
  },

  minimize: () => ipcRenderer.send('minimize'),
  maximize: () => ipcRenderer.send('maximize'),
  close: () => ipcRenderer.send('close')
});

