// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Type } from '@cmfx/vite-plugin-api';
import { JSX } from 'solid-js';

import { Stages } from '../../stages';

import { default as C1 } from './table';
import { default as s1 } from './table.tsx?raw';

import { default as C2 } from './basic';
import { default as s2 } from './basic.tsx?raw';

import { default as C3 } from './loader';
import { default as s3 } from './loader.tsx?raw';

import { default as C4 } from './paging';
import { default as s4 } from './paging.tsx?raw';

import { default as api } from './api.json' with { type: 'json' };

export default function(): JSX.Element {
    return <Stages dir='demo/table' api={api as Array<Type>} stages={[
        { component: C1, source: s1, layout: 'vertical', title: '表格', desc: '基本的表格功能，与 HTML 的 table 相同，加上了部分控制功能。' },
        { component: C2, source: s2, layout: 'vertical', title: '数据表格', desc: '用于展示数据，但是不支持分页。' },
        { component: C3, source: s3, layout: 'vertical', title: '数据表格', desc: '用于展示数据，可通过方法加载数据内容，支持分页。' },
        { component: C4, source: s4, layout: 'vertical', title: '数据表格', desc: '用于展示数据，可通过方法加载数据内容，支持分页。' },
    ]}>
    </Stages>;
}
