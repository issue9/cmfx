// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { ExtractorConfig, Extractor as XExtractor } from '@microsoft/api-extractor';
import { ApiItem, ApiModel } from '@microsoft/api-extractor-model';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { conv } from './conv';

export class Extractor {
    #model = new ApiModel();

    /**
     * 加载项目中的 .d.ts 文档
     *
     * @param root - 项目的根目录；
     * @param entrypoints - 项目中需要引入的文件名，如果为空，则会采用 ['index.d.ts']；
     */
    load(root: string, ...entrypoints: Array<string>) {
        root = path.resolve(__dirname, root);
        const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'vite-plugin-api-'));

        if (entrypoints.length === 0) {
            entrypoints = ['index.d.ts'];
        }

        for (const ep of entrypoints) {
            const dtsPath = path.join(root, 'lib', ep);
            const outPath = path.resolve(tmp+ep+'.api.json');
            const config = ExtractorConfig.prepare({
                configObject: {
                    projectFolder: root,
                    mainEntryPointFilePath: dtsPath,
                    docModel: { enabled: true, apiJsonFilePath: outPath },
                    compiler: {
                        tsconfigFilePath: path.resolve(root, 'tsconfig.json')
                    }
                },
                configObjectFullPath: path.resolve(__dirname, './api-extractor.json'),
                packageJsonFullPath: path.join(root, 'package.json'),
            });

            const result = XExtractor.invoke(config, {
                localBuild: true,
                showVerboseMessages: true,
            });

            if (!result.succeeded) {
                throw new Error(`提取 ${root} 失败`);
            }

            this.#model.loadPackage(outPath);
        }
    }

    /**
     * 查找指定名称的类型
     *
     * @param pkg - 包名称，一般为 package.json 中的名称；
     * @param entrypoint - .d.ts 文件名，比如 message.d.ts、index.d.ts 等；
     * @param names - 需要查找的类型名称列表；
     */
    extract(pkg: string, entrypoint: string, ...names: Array<string>): Array<ApiItem> {
        entrypoint = entrypoint.endsWith('.d.ts') ? entrypoint.slice(0, -5) : entrypoint;
        if (entrypoint === 'index') {
            entrypoint = '';
        }

        for(const p of this.#model.packages) {
            if (p.displayName === pkg) {
                for(const entry of p.entryPoints) {
                    if (entry.displayName === entrypoint) {
                        const items = entry.members.filter(item => names.includes(item.displayName));
                        if (items.length < names.length) {
                            const itemsSet = new Set(items.map(i=>i.displayName));
                            const missing = names.filter(item => !itemsSet.has(item));
                            throw new Error(`提取 ${pkg}/${entrypoint} 失败，未找到所有类型：${missing.join(', ')}`);
                        }
                        return items;
                    }
                } // end for
            }
        } // end for

        return [];
    }

    /**
     * 将由 {@link extract} 提取的类型写入文件
     */
    write(items: Array<ApiItem>, path: string): void {
        const ts = [];
        for (const item of items) {
            ts.push(conv(item));
        }

        fs.writeFileSync(path, JSON.stringify(ts, null, 2));
    }
}
