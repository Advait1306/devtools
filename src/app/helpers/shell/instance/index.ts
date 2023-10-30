import {exec, spawn} from "child_process";
import {mainWindow} from "../../../../main";

export async function createSSHKey(event: Electron.IpcMainInvokeEvent, ...args: any[]) {
    return new Promise((resolve, reject) => {
        exec('rm -rf ~/.ssh/tic-devtools-ssh', (err, stdout, stderr) => {
            exec('ssh-keygen -f ~/.ssh/tic-devtools-ssh -N \'\' -C developer', (err, stdout, stderr) => {
                exec('cat ~/.ssh/tic-devtools-ssh.pub', (err, stdout, stderr) => {
                    resolve(stdout)
                });
            })
        })
    })
}

export async function connectViaSSH(event: Electron.IpcMainInvokeEvent, ...args: any[]) {
    const shell = spawn('ssh', ['-i', '~/.ssh/tic-devtools-ssh', `developer@${args[0]}`]);

    shell.stdout.on('data', data => {
        console.log(`ssh-stdout:\n${data}`);
    })
    shell.stderr.on("data", (data) => {
        console.log(`ssh-stdout: ${data}`);
    });

    shell.on('exit', () => {
        console.log('ssh-exited')
        mainWindow.webContents.send('ssh-disconnected')
    })
}

export async function launchRemoteVSCode(event: Electron.IpcMainInvokeEvent, ...args: any[]) {
    const ip = args[0]

    exec('rm -rf ~/.ssh/tic_config', (err, stdout, stderr) => {
        console.log('err', err)
        console.log('stdout', stdout)
        console.log('stderr', stderr)

        exec('touch ~/.ssh/tic_config', (err, stdout, stderr) => {
            console.log('err', err)
            console.log('stdout', stdout)
            console.log('stderr', stderr)

            exec(`echo "Host developer \n  HostName ${ip} \n  User developer \n  IdentityFile ~/.ssh/tic-devtools-ssh" | cat > ~/.ssh/tic_config`, (err, stdout, stderr) => {
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
}
