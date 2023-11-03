import {app, BrowserWindow, ipcMain} from 'electron';
import path from 'path';
import process from "process";
import {exec} from 'child_process';
import {connectViaSSH, createSSHKey, launchRemoteVSCode} from "./app/helpers/shell/instance";
import {copyToClipboard} from "./app/helpers/clipboard";
import {updateElectronApp, UpdateSourceType} from "update-electron-app";
import {log} from "electron-log";


if (app.isPackaged) {
    updateElectronApp({
        updateSource: {
            type: UpdateSourceType.ElectronPublicUpdateService,
            repo: 'sixhuman/devtools-release'
        },
        logger: {
            info: (message: string) => {
                console.log(message)
                log(message)
            },
            warn: (message: string) => {
                console.log(message)
                log(message)
            },
            error: (message: string) => {
                console.log(message)
                log(message)
            },
            log(message: string) {
                console.log(message)
                log(message)
            }
        }
    });
}

export let mainWindow: BrowserWindow | null;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
    app.quit();
}

if (process.defaultApp) {
    if (process.argv.length >= 2) {
        app.setAsDefaultProtocolClient('tic-devtools', process.execPath, [path.resolve(process.argv[1])]);
    } else {
        app.setAsDefaultProtocolClient('tic-devtools')
    }
}

const createWindow = () => {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        title: 'Devtools',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
        },
    });

    // and load the index.html of the app.
    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
        mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    } else {
        mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
    }

    // Open the DevTools.
    if (!app.isPackaged || true) {
        mainWindow.webContents.openDevTools();
    }
};

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
    app.quit();
} else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        if (mainWindow) {
            if (mainWindow.isMinimized()) {
                mainWindow.restore();
            }
            mainWindow.focus();

            // dialog.showErrorBox('Welcome Back', `You arrived from: ${commandLine.pop().slice(0, -1)}`)
        }
    });

    app.whenReady().then(() => {

        ipcMain.handle('check-code', async (event, args) => {
            return new Promise((resolve, reject) => {
                exec('code -v', (err, stdout, stderr) => {
                    console.log('err', err)
                    console.log('stdout', stdout)
                    console.log('stderr', stderr)

                    resolve(stdout)
                });
            })
        })

        ipcMain.handle('generate-ssh-key', createSSHKey)

        ipcMain.handle('connect-to-instance', connectViaSSH)

        ipcMain.handle('launch-remote-vsc', launchRemoteVSCode)

        ipcMain.handle('copy-to-clipboard', copyToClipboard)

        ipcMain.handle('get-app-version', () => {
            return app.getVersion();
        })

        createWindow()
    })

    app.on('open-url', (event, url) => {
        console.log('open-url', url);
        if (mainWindow) {
            mainWindow.webContents.send('link', url)
        }
    })
}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});


