const {contextBridge, ipcRenderer} = require('electron')
const { exec, spawn } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    handleLink: (callback: (event: any, ...args: any[]) => void) => ipcRenderer.on('link', callback),
    checkCode: () => ipcRenderer.invoke('check-code'),
    openVSCodeRemoteConfig: () => ipcRenderer.invoke('open-vscode-remote-config'),
    generateSSHKey: () => ipcRenderer.invoke('generate-ssh-key'),
})
