// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const {contextBridge, ipcRenderer} = require('electron')

contextBridge.exposeInMainWorld('electron', {
    handleLink: (callback: (event: any, ...args: any[]) => void) => ipcRenderer.on('link', callback),
})
