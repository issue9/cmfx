// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import type { About, Package } from '@cmfx/admin/plugin';
import { aboutName } from '@cmfx/admin/plugin';
import { readFileSync } from 'node:fs';
import { ConfigPluginContext, Plugin, UserConfig } from 'vite';

import pkg from '../package.json';
import { initPnpmVersionSearch, parseGomods } from './files';

/**
 * 初始化插件的选项
 */
export interface Options {
    /**
     * go.mod 列表
     */
    gomods?: Array<string>;

    /**
     * 前端的 package.json 列表
     */
    packages: Array<string>;
}

// 描述 package.json 的格式
interface PackageJSON {
    version: string;
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
}

/**
 * 用于生成关于页面的数据
 */
export function about(options: Options): Plugin<Options> {
    const about: About = {
        version: '',
        dependencies: [],
        devDependencies: [],
        serverDependencies: parseGomods(options.gomods)
    };

    for (const p of options.packages) {
        const file = JSON.parse(readFileSync(p, { encoding: 'utf-8' })) as PackageJSON;

        if (!about.version && file.version) { about.version = file.version; }

        if (file.dependencies) {
            Object.entries(file.dependencies).forEach((item) => {
                about.dependencies.push({ name: item[0], version: item[1] });
            });
        }

        if (file.devDependencies) {
            Object.entries(file.devDependencies).forEach((item) => {
                about.devDependencies.push({ name: item[0], version: item[1] });
            });
        }
    }

    return {
        name: 'vite-plugin-cmfx-about',

        async config(this: ConfigPluginContext , _: UserConfig) {
            const search = await initPnpmVersionSearch();

            // 替换依赖项的 catalog 和 workspace 为真实的版本号
            const replaceVersion = (deps: Array<Package>) => {
                for (const item of deps) {
                    switch (item.version) {
                    case 'catalog:':
                        const ver = search(item.name);
                        item.version = ver ?? item.version;
                        break;
                    case 'workspace:*':
                        item.version = pkg.version; // 所有包采用相同的版本号，所以直接拿当前包的版本号使用。
                        break;
                    }
                }
            };

            replaceVersion(about.dependencies);
            replaceVersion(about.devDependencies);

            return {
                define: {
                    [aboutName]: about,
                }
            };
        }
    };
}
