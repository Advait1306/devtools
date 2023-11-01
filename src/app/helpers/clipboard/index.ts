const { clipboard } = require('electron')
export const copyToClipboard = (event: Electron.IpcMainInvokeEvent, ...args: any[])  => clipboard.writeText(args[0])

