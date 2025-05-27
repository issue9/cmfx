// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { readFileSync } from 'fs';
import { Plugin } from 'vite';

export interface Options {
    gomod?: Array<string>;
    packages: Array<string>;
}

export const __CMFX_ABOUT__ = '__CMFX_ABOUT__';

export interface About {
    dependencies: Array<Package>;
    devDependencies: Array<Package>;
    serverDependencies: Array<Package>;
    version: string;
}

export interface Package {
    name: string;
    version: string;
    license?: string;
}

// 描述 package.json 的格式
interface PackageJSON {
    version: string;
    dependencies: Record<string, string>;
    devDependencies: Record<string, string>;
}

export function about(options: Options): Plugin {
    const about: About = {
        version: '',
        dependencies: [],
        devDependencies: [],
        serverDependencies: []
    };
    
    for(const p of options.packages) {
        const file = JSON.parse(readFileSync(p, { encoding: 'utf-8' })) as PackageJSON;

        if (!about.version && file.version) {
            about.version = file.version;
        }

        Object.entries(file.dependencies).forEach((item) => {
            about.dependencies.push({ name: item[0], version: item[1] });
        });
        
        Object.entries(file.devDependencies).forEach((item) => {
            about.devDependencies.push({ name: item[0], version: item[1] });
        });
    }
    
    return {
        name: 'vite-plugin-cmfx-about',
        config: () => ({
            define: {
                [__CMFX_ABOUT__]: about
            }
        })
    };
}
