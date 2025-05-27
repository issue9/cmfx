// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { readFileSync } from 'node:fs';
import { Plugin } from 'vite';

import { initPnpmVersionSearch, Package, parseGomods } from './files';

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

/**
 * 附加在环境变量上的名称
 */
export const __CMFX_ABOUT__ = '__CMFX_ABOUT__';

/**
 * 生成的关于页面的数据
 */
export interface About {
    /**
     * 前端的生产环境依赖列表
     */
    dependencies: Array<Package>;

    /**
    * 前端的开发环境依赖列表
    */
    devDependencies: Array<Package>;

    /**
     * 后端的依赖列表
     */
    serverDependencies: Array<Package>;

    /**
     * 软件版本
     */
    version: string;
}

// 描述 package.json 的格式
interface PackageJSON {
    version: string;
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
}

/**
 * 用于生成关于页面的数据，这些数据通过环境变量 {@link __CMFX_ABOUT__} 传递给该页面。
 */
export function about(options: Options): Plugin {
    const about: About = {
        version: '',
        dependencies: [],
        devDependencies: [],
        serverDependencies: parseGomods(options.gomods)
    };

    for(const p of options.packages) {
        const file = JSON.parse(readFileSync(p, { encoding: 'utf-8' })) as PackageJSON;

        if (!about.version && file.version) {
            about.version = file.version;
        }

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

        config: async () => {
            const search = await initPnpmVersionSearch();

            // 替换 catalog 为真实的版本号
            for(const item of about.dependencies) {
                if (item.version === 'catalog:') {
                    const ver = search(item.name);
                    item.version = ver ? ver : item.version;
                }
            }
            for(const item of about.devDependencies) {
                if (item.version === 'catalog:') {
                    const ver = search(item.name);
                    item.version = ver ? ver : item.version;
                }
            }

            return {
                define: {
                    [__CMFX_ABOUT__]: about
                }
            };
        }
    };
}
