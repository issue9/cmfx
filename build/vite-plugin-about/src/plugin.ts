// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { readFileSync } from 'node:fs';
import { Plugin } from 'vite';

import { initPnpmVersionSearch, parseGomods } from './files';
import { About } from './global';

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
 *
 * 这些数据可通过全局变量 __CMFX_ABOUT__ 获取。如果是 ts 环境，需要 __CMFX_ABOUT__
 * 的类型，可通过以下两种方式获取：
 *  - /// <reference types="@cmfx/vite-plugin-about" /> 单个文件中使用；
 *  - 在 vite.config.ts 的 compilerOptions.types 添加 `@cmfx/vite-plugin-about`，则是整个项目都可使用；
 *
 * @returns vite 插件
 */
export function about(options: Options): Plugin {
    const about: About = {
        version: '',
        dependencies: [],
        devDependencies: [],
        serverDependencies: parseGomods(options.gomods)
    };

    for (const p of options.packages) {
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
            for (const item of about.dependencies) {
                if (item.version === 'catalog:') {
                    const ver = search(item.name);
                    item.version = ver ? ver : item.version;
                }
            }
            for (const item of about.devDependencies) {
                if (item.version === 'catalog:') {
                    const ver = search(item.name);
                    item.version = ver ? ver : item.version;
                }
            }

            return {
                define: {
                    '__CMFX_ABOUT__': about
                }
            };
        }
    };
}
