import ShellEngine from "../shell.engine";

const shellEngine = new ShellEngine();

export async function createNewSSHKey(event: Electron.IpcMainInvokeEvent, ...args: any[]) {
    const [o, s, e] = await shellEngine.removeSSHKey();
    const [o1, s1, e1] = await shellEngine.createSSHKey();
    const [o2, s2, e2] = await shellEngine.readPublicKey();

    return o2;
}

export async function connectViaSSH(event: Electron.IpcMainInvokeEvent, ...args: any[]) {
    shellEngine.connectSSH({ip: args[0]});
}

export async function launchRemoteVSCode(event: Electron.IpcMainInvokeEvent, ...args: any[]) {

    const [o, s, e] = await shellEngine.removeSSHConfig();
    const [o1, s1, e1] = await shellEngine.createSSHConfig({ip: args[0]});
    const [o2, s2, e2] = await shellEngine.readSSHConfig();

    if(!o2.includes('Include "tic_config"')) {
        const [o3, s3, e3] = await shellEngine.prependSSHConfig();
    }

    const [o4, s4, e4] = await shellEngine.launchRemoteVSCode({ip: args[0]});
}
