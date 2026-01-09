// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { ApiItem } from '@microsoft/api-extractor-model';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { Plugin } from 'vite';
import YAML from 'yaml';

import { Extractor } from './extract';

// 配置文件名
const filename = 'api';

/**
 * 插件配置项
 */
export interface Options {
    /**
     * 指定需要加载的文件
     *
     * @remarks
     * 第一个元素指向包的根目录，必须得一个绝对路径；
     * 第二个元素指向包中 lib/ 下的 entrypoint 的文件名称，比如 index.d.ts；
     */
    dts: Array<[pkg: string, entrypoint: string]>;

    /**
     * 文档根目录
     *
     * @remarks
     * 将扫描该目录下所有的 `api.yaml` 文件，并根据其内容生成一个对应的 api.json 文件。
     */
    root: string;
}

interface Package {
    pkg: string;
    entrypoints: Array<{
        entrypoint: string;
        types: Array<string>;
    }>;
}

/**
 * 根据配置提取指定项目下的对象注释作为文档
 */
export default function api(o: Options): Plugin {
    const parser = new Extractor();

    for(const [pkg, entrypoint] of o.dts) {
        parser.load(pkg, entrypoint);
    }

    return {
        name: 'vite-plugin-cmfx-api',

        buildStart: () => {
            const files = findAPIFile(o.root);
            for(const f of files) {
                const types: Array<ApiItem> = [];
                const pkgs: Array<Package> = YAML.parse(readFileSync(f, { encoding: 'utf-8' }));
                for (const pkg of pkgs) {
                    for(const entrypoint of pkg.entrypoints) {
                        const items = parser.extract(pkg.pkg, entrypoint.entrypoint, ...entrypoint.types);
                        types.push(...items);
                    }
                }

                const dir = path.dirname(f);
                parser.write(types, path.join(dir, `${filename}.json`));
            }
        }
    };
}

function findAPIFile(dir: string): string[] {
    const result: string[] = [];

    const walk = (currentPath: string) => {
        const items = readdirSync(currentPath);
        for (const item of items) {
            const itemPath = path.join(currentPath, item);
            const stat = statSync(itemPath);

            if (stat.isDirectory()) {
                walk(itemPath); // 递归子目录
            } else if (item === `${filename}.yaml`) {
                result.push(itemPath); // 匹配名称
            }
        }
    };

    walk(dir);
    return result;
}
