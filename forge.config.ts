import type {ForgeConfig} from '@electron-forge/shared-types';
import {MakerSquirrel} from '@electron-forge/maker-squirrel';
import {MakerZIP} from '@electron-forge/maker-zip';
import {MakerDeb} from '@electron-forge/maker-deb';
import {MakerRpm} from '@electron-forge/maker-rpm';
import {VitePlugin} from '@electron-forge/plugin-vite';

const config: ForgeConfig = {
    packagerConfig: {
        icon: 'src/app/assets/images/devtools_icon',
        osxSign: {
            identity: 'Developer ID Application: Advait Bansode (N8K96VJAHS)',
        },
        osxNotarize: {
            tool: 'notarytool',
            appleId: 'advaitbansode4@gmail.com',
            appleIdPassword: 'zgdv-xlnf-bbkw-mcpl',
            teamId: 'N8K96VJAHS',
        }
    },
    rebuildConfig: {},
    makers: [
        new MakerSquirrel({}),
        new MakerZIP({}, ['darwin']),
        new MakerRpm({}),
        new MakerDeb({}),
        {
            name: '@electron-forge/maker-dmg',
            config: {
                format: 'ULFO'
            }
        }
    ],
    plugins: [
        new VitePlugin({
            // `build` can specify multiple entry builds, which can be Main process, Preload scripts, Worker process, etc.
            // If you are familiar with Vite configuration, it will look really familiar.
            build: [
                {
                    // `entry` is just an alias for `build.lib.entry` in the corresponding file of `config`.
                    entry: 'src/main.ts',
                    config: 'vite.main.config.ts',
                },
                {
                    entry: 'src/preload.ts',
                    config: 'vite.preload.config.ts',
                },
            ],
            renderer: [
                {
                    name: 'main_window',
                    config: 'vite.renderer.config.ts',
                },
            ],
        }),
    ],
    publishers: [
        {
            name: '@electron-forge/publisher-github',
            config: {
                repository: {
                    owner: 'sixhuman',
                    name: 'devtools-release'
                },
                authToken: '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'
            }
        }
    ]
};

export default config;
