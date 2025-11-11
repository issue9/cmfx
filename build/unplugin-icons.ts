// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { promises as fs } from 'node:fs';
import path from 'node:path';

/**
 * 用于配置 unplugin-icons 中自定义图标
 *
 * @remarks
 * 将返回值赋给 customCollections 字段即可。
 *
 * 之所以提取出来，是因为 packages/components 需要用到，
 * 而 apps/docs 下需要热加载 packages/components 也需要用到。
 *
 * NOTE: 记得将文件加入到 tsconfig.node.json 的 include 字段中。
 */
export default {
    cmfx: {
        'brand-static': () => fs.readFile(path.resolve(__dirname, '../assets/brand-static.svg'), 'utf-8'),
        'brand-animate': () => fs.readFile(path.resolve(__dirname, '../assets/brand-animate.svg'), 'utf-8'),
    },
};
