import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import process from "process";
import { spawn, exec } from 'child_process';

let mainWindow: BrowserWindow | null;

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
  mainWindow.webContents.openDevTools();
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

    ipcMain.handle('generate-ssh-key', async (event, args) => {
      return new Promise((resolve, reject) => {
        exec('ssh-keygen -f ~/.ssh/test3 -N \'\' -C developer', (err, stdout, stderr) => {
            console.log('err', err)
            console.log('stdout', stdout)
            console.log('stderr', stderr)

            exec('cat ~/.ssh/test3.pub', (err, stdout, stderr) => {
                console.log('err', err)
                console.log('stdout', stdout)
                console.log('stderr', stderr)

                resolve(stdout)
            });
        })
      })
    })

    ipcMain.handle('open-vscode-remote-config', async (event, args) => {
      exec('rm -rf ~/.ssh/tic_config', (err, stdout, stderr) => {
        console.log('err', err)
        console.log('stdout', stdout)
        console.log('stderr', stderr)

        exec('touch ~/.ssh/tic_config', (err, stdout, stderr) => {
          console.log('err', err)
          console.log('stdout', stdout)
          console.log('stderr', stderr)

          exec('echo "Host developer \n  HostName 35.207.199.109 \n  User developer \n  IdentityFile ~/.ssh/developer" | cat > ~/.ssh/tic_config', (err, stdout, stderr) => {
            console.log('err', err)
            console.log('stdout', stdout)
            console.log('stderr', stderr)

            exec('cat ~/.ssh/config', (err, stdout, stderr) => {
              if(!stdout.includes('Include "tic_config"')) {
                console.log('doesnt include')

                exec('echo "Include \\"tic_config\\"" | cat - ~/.ssh/config > tempfile && mv tempfile ~/.ssh/config', (err, stdout, stderr) => {
                    console.log('err', err)
                    console.log('stdout', stdout)
                    console.log('stderr', stderr)

                    console.log('attempting vsc run')
                    exec('code --folder-uri "vscode-remote://ssh-remote+developer/home/developer"', (err, stdout, stderr) => {
                      console.log('vsc run')
                      console.log('err', err)
                      console.log('stdout', stdout)
                      console.log('stderr', stderr)
                    })
                })
              } else {
                console.log('attempting vsc run')
                exec('code --folder-uri "vscode-remote://ssh-remote+developer/home/developer"', (err, stdout, stderr) => {
                  console.log('vsc run')
                  console.log('err', err)
                  console.log('stdout', stdout)
                  console.log('stderr', stderr)
                })
              }
            })
          })
        })
      });
    })

    createWindow()
  })

  app.on('open-url', (event, url) => {
    console.log('open-url', url);
    if(mainWindow) {
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


