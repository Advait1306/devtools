import process from "process";
import {exec, spawn} from "child_process";
import {mainWindow} from "../../../main";

enum OS {
    darwin,
    win32,
    linux,
    unsupported
}

export default class ShellEngine {

    private checkOS(): OS {
        const platform = process.platform;

        if (platform == 'darwin') return OS.darwin
        if (platform == 'win32') return OS.win32
        if (platform == 'linux') return OS.linux

        return OS.unsupported
    }

    private checkAndThrowUnsupportedOS() {
        const os = this.checkOS()
        if (os == OS.unsupported) throw new Error('Unsupported OS')
        return os;
    }

    removeSSHKey() {
        const os = this.checkAndThrowUnsupportedOS();
        const command = os === OS.darwin
            ? 'rm -rf ~/.ssh/tic-devtools-ssh'
            : 'del /f /s /q ~/.ssh/tic-devtools-ssh';

        return this.exec(command)
    }

    createSSHKey() {
        const os = this.checkAndThrowUnsupportedOS();
        const command = os === OS.darwin
            ? "ssh-keygen -f ~/.ssh/tic-devtools-ssh -N '' -C developer"
            : "ssh-keygen -f \"$env:USERPROFILE/.ssh/tic-devtools-ssh\" -C \"developer\" -N ''";

        return this.exec(command)
    }

    readPublicKey() {
        const os = this.checkAndThrowUnsupportedOS();
        const command = os === OS.darwin
        ? 'cat ~/.ssh/tic-devtools-ssh.pub':
        'Get-Content -Path "$env:USERPROFILE\\.ssh\\tic-devtools-ssh.pub"';

        return this.exec(command)
    }

    removeSSHConfig() {
        const os = this.checkAndThrowUnsupportedOS();
        const command = os === OS.darwin
            ? 'rm -rf ~/.ssh/tic_config'
            : 'del /f /s /q ~/.ssh/tic_config';

        return this.exec(command)
    }

    createSSHConfig({ip}: { ip: string }) {
        const os = this.checkAndThrowUnsupportedOS();
        const command = os === OS.darwin
            ? `echo "Host developer \n  HostName ${ip} \n  User developer \n  IdentityFile ~/.ssh/tic-devtools-ssh" | cat > ~/.ssh/tic_config`
            : `
            @"
            Host developer
              HostName ${ip}
              User developer
              IdentityFile ~/.ssh/tic-devtools-ssh
            "@ | Out-File -FilePath "$env:USERPROFILE\\Documents\\ssh_config" -Encoding utf8
            `

        return this.exec(command)
    }

    readSSHConfig() {
        const os = this.checkAndThrowUnsupportedOS();
        const command = os === OS.darwin
            ? 'cat ~/.ssh/config'
            : 'Get-Content -Path "$env:USERPROFILE\\Documents\\ssh_config"';

        return this.exec(command)
    }

    prependSSHConfig() {
        const os = this.checkAndThrowUnsupportedOS();
        const command = os === OS.darwin
            ? 'echo "Include \\"tic_config\\"" | cat - ~/.ssh/config > tempfile && mv tempfile ~/.ssh/config'
            : `
            @"
            Include "tic_config"
            "@ | Out-File -FilePath "$env:USERPROFILE\\Documents\\ssh_config" -Encoding utf8
            `

        return this.exec(command)
    }

    connectSSH({ip}: { ip: string }) {
        const os = this.checkAndThrowUnsupportedOS();
        const command = os === OS.darwin
            ? `ssh`
            : `ssh`;

        const args = os === OS.darwin
            ? ['-i', '~/.ssh/tic-devtools-ssh', `developer@${ip}`]
            : ['-i', '~/.ssh/tic-devtools-ssh', `developer@${ip}`];

        return this.spawn(command, args, console.log, () => {
            mainWindow.webContents.send('ssh-disconnected')
        })
    }

    launchRemoteVSCode({ip}: { ip: string }) {
        const os = this.checkAndThrowUnsupportedOS();
        const command = os === OS.darwin
            ? `export PATH=$PATH:/usr/local/bin;code --folder-uri "vscode-remote://ssh-remote+developer/home/developer"`
            : `export PATH=$PATH:/usr/local/bin;code --folder-uri "vscode-remote://ssh-remote+developer/home/developer"`;

        return this.exec(command)
    }

    private spawn(command: string, args: string[], onData: (data: string) => void, onExit: () => void) {
        const shell = spawn(command, args);
        shell.on('data', onData)
        shell.on('exit', onExit)
    }

    private exec(command: string): Promise<[string, string, Error]> {
        return new Promise((resolve) => {
            exec(command, (err, stdout, stderr) => {
                resolve([stdout, stderr, err]);
            })
        })
    }
}
