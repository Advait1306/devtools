import process from "process";
import {log} from "electron-log";
import {exec, spawn, ChildProcess} from "child_process";
import {mainWindow} from "../../../main";

enum OS {
    darwin,
    win32,
    linux,
    unsupported
}

export default class ShellEngine {

    shell: ChildProcess | undefined = undefined;

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
            : 'Remove-Item -Path ~/.ssh/tic-devtools-ssh -Force';

        return this.exec(command)
    }

    createSSHKey() {
        const os = this.checkAndThrowUnsupportedOS();
        const command = os === OS.darwin
            ? "ssh-keygen -f ~/.ssh/tic-devtools-ssh -N '' -C developer"
            : "ssh-keygen -f $env:USERPROFILE/.ssh/tic-devtools-ssh -C \"developer\" -N '\"\"'";

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
            : 'Remove-Item -Path ~/.ssh/tic_config -Force';

        return this.exec(command)
    }

    createSSHConfig({ip}: { ip: string }) {
        const os = this.checkAndThrowUnsupportedOS();
        const command = os === OS.darwin
            ? `echo "Host developer \n  HostName ${ip} \n  User developer \n  IdentityFile ~/.ssh/tic-devtools-ssh" | cat > ~/.ssh/tic_config`
            : `"\`nHost developer\`n  HostName ${ip}\`n  User developer\`n  IdentityFile ~/.ssh/tic-devtools-ssh\`n" | Out-File -FilePath "$env:USERPROFILE/.ssh/tic_config" -Encoding utf8`

        return this.exec(command)
    }

    readSSHConfig() {
        const os = this.checkAndThrowUnsupportedOS();
        const command = os === OS.darwin
            ? 'cat ~/.ssh/config'
            : 'Get-Content -Path "$env:USERPROFILE/.ssh/config"';

        return this.exec(command)
    }

    prependSSHConfig() {
        const os = this.checkAndThrowUnsupportedOS();
        const command = os === OS.darwin
            ? 'echo "Include \\"tic_config\\"" | cat - ~/.ssh/config > tempfile && mv tempfile ~/.ssh/config'
            : `Set-Content -Path "$env:USERPROFILE/.ssh/config" -Value $("Include ""tic_config""" + [Environment]::NewLine + (Get-Content -Path "$env:USERPROFILE/.ssh/config" -Raw)) -Encoding utf8`

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
            : `code --folder-uri "vscode-remote://ssh-remote+developer/home/developer"`;

        return this.exec(command)
    }

    test() {
        // this.spawn('ls', [], console.log, () => console.log('exit'))
        // this.removeSSHKey();
        // this.createSSHKey();
    }

    installLinuxModules() {
        const command = 'sudo apt install linux-modules-extra-`uname -r`'
        return this.remoteExec(command)
    }

    installBinders() {
        const command = 'sudo modprobe binder_linux devices="binder,hwbinder,vndbinder"'
        this.remoteExec(command)
    }

    startAndroidDocker() {
        const command = 'docker run -itd --rm --privileged --pull always -v ~/data:/data -p 5555:5555 redroid/redroid:14.0.0-latest'
        this.remoteExec(command)
    }

    connectAdb({ip}: { ip: string }) {
        const os = this.checkAndThrowUnsupportedOS();
        const command = os === OS.darwin
            ? `adb connect ${ip}`
            : `adb connect ${ip}`;

        return this.exec(command)
    }

    disconnectAdb({ip}: { ip: string }) {
        const os = this.checkAndThrowUnsupportedOS();
        const command = os === OS.darwin
            ? `adb disconnect ${ip}`
            : `adb disconnect ${ip}`;

        return this.exec(command)
    }

    startScrcpy({ip}: { ip: string }) {
        const os = this.checkAndThrowUnsupportedOS();
        const command = os === OS.darwin
            ? `scrcpy`
            : `scrcpy`;

        const args = os === OS.darwin
            ? ['-s', ip]
            : ['-s', ip];

        return this.exec(command);
    }



    private spawn(command: string, args: string[], onData: (data: string) => void, onExit: () => void) {
        const os = this.checkOS()
        this.shell = spawn(command, args, os === OS.win32 ? {'shell':'powershell.exe'} : {});
        this.shell.stdout.on('data', (data) => {
            const dataString = data.toString();
            // const dataJson = eval(`(${dataString})`);
            console.log('spawn-data')
            console.log(dataString)

            log('spawn-data')
            log(dataString)

            onData(data)
        })
        this.shell.stderr.on('data', (data) => {
            const dataString = data.toString();
            // const dataJson = eval(`(${dataString})`);
            console.log('spawn-err')
            console.log(dataString)

            log('spawn-err')
            log(dataString)
            onData(data)
        })

        this.shell.on('exit', (data) => {
            console.log('spawn-exit')
            console.log(data)

            log('spawn-exit')
            log(data)
            onExit()
        })
    }

    private exec(command: string): Promise<[string, string, Error]> {
        return new Promise((resolve) => {
            const os = this.checkOS()
            exec(command, os === OS.win32 ? {'shell':'powershell.exe'} : {}, (err, stdout, stderr) => {
                console.log('========================================')
                console.log(command)
                console.log(stdout)
                console.log(stderr)
                console.log(err)
                console.log('========================================')

                log('========================================')
                log(command)
                log(stdout)
                log(stderr)
                log(err)
                log('========================================')
                resolve([stdout, stderr, err]);
            })
        })
    }

    private remoteExec(command: string) {
        console.log(command)
        // Write this command to this.shell
        this.shell.stdin.write(command)
        // Write a newline to this.shell
        this.shell.stdin.write('\n')
    }
}
