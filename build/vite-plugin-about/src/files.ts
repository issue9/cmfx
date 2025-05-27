// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';

/**
 * 向上查找指定的文件，如果存在则返回该文件的路径。
 * @param filenames 需要查找的文件列表；
 * @param dir 起始目录；
 */
export function findUp(filenames: Array<string>, dir = process.cwd()): string | undefined {
    // NOTE: 有现在的方法 find-up，但是在 vite 中引用第三方库包含 nodejs 模块时会比较麻烦。
    // 在不考虑更换打包工具的情况下，自己实现是比较简单的。

    let currentDir = dir;

    while (currentDir !== path.parse(currentDir).root) {
        for (const f of filenames) {
            const filePath = path.join(currentDir, f);
            if (existsSync(filePath)) {
                return filePath;
            }
        }

        currentDir = path.dirname(currentDir); // 向上移动到父目录
    }
}

export interface Package {
    name: string;
    version: string;
}

/**
 * 解析 go.mod 中的的包信息
 */
export function parseGomods(paths?: Array<string>): Array<Package> {
    if (!paths) {
        return [];
    }

    const pkgs: Array<Package> = [];
    for(const p of paths) {
        pkgs.push(...parseGomod(p));
    }
    return pkgs;
}

function parseGomod(path: string): Array<Package> {
    const lines = readFileSync(path, { encoding: 'utf-8' }).split('\n');
    const ret: Array<Package> = [];
    
    let require = false;
    for(let line of lines) {
        line = line.trim();

        if (line === 'require (') {
            require = true;
            continue;
        }

        if (line === ')') {
            require = false;
            continue;
        }
        
        if (require) {
            const kv = line.split(' ');
            ret.push({ name: kv[0], version: kv[1] });
        }
    }

    return ret;
}

/**
 * 初始化一个用于搜索软件包具体版本号的函数
 */
export async function initPnpmVersionSearch(): Promise<Search> {
    const p = findUp(['pnpm-workspace.yaml', 'pnpm-workspace.json']);
    if (!p) {
        return (_: string) => { return ''; };
    }

    const data = readFileSync(p, { encoding: 'utf-8' });
    let workspace: PnpmWorkspace;
    if (p.endsWith('.json')) {
        workspace = JSON.parse(data);
    } else {
        workspace = YAML.parse(data);
    }
    
    return (s: string)=>{
        const item = Object.entries(workspace.catalog).find((item) => item[0] === s);
        return item ? item[1] : '';
    };
}

interface Search {
    (s: string): string;
}

interface PnpmWorkspace {
    catalog: Record<string, string>;
}