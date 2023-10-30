const {contextBridge, ipcRenderer} = require('electron')
const { exec, spawn } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    handleLink: (callback: (event: any, ...args: any[]) => void) => ipcRenderer.on('link', callback),
    checkCode: () => ipcRenderer.invoke('check-code'),
    generateSSHKey: () => ipcRenderer.invoke('generate-ssh-key'),
    connectToInstance: (ip: string) => ipcRenderer.invoke('connect-to-instance', ip),
    sshDisconnected: (callback: (event: any, ...args: any[]) => void) => {
        ipcRenderer.on('ssh-disconnected', callback)
        return () => ipcRenderer.removeListener('ssh-disconnected', callback)
    },
    launchRemoteVSC: (ip: string) => ipcRenderer.invoke('launch-remote-vsc', ip)
})
