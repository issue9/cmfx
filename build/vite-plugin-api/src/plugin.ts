// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { Plugin } from 'vite';
import YAML from 'yaml';

import { Parser } from './parser';

// 配置文件名
const filename = 'api';

/**
 * 插件配置项
 */
export interface Options {
    /**
     * 组件包的根目录
     *
     * @remarks
     * 将从该目录下的 index.d.ts 中读取文档内容。
     */
    components: string;

    /**
     * 文档项目中所有 api 文档的公共根目录
     */
    root: string;
}

/**
 * 根据配置提取指定项目下的对象注释作为文档
 */
export default function api(o: Options): Plugin {
    const parser = new Parser(o.components);

    return {
        name: 'vite-plugin-cmfx-api',

        buildStart: () => {
            const files = findAPIFile(o.root);
            for(const f of files) {
                const props: Array<string> = YAML.parse(readFileSync(f, { encoding: 'utf-8' }));
                const objs = parser.prorps(props);

                const dir = path.dirname(f);
                writeFileSync(path.join(dir, `${filename}.json`), JSON.stringify(objs, null, 2));
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
