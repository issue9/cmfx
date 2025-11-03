// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { Stages } from '../../stages';

import { default as C4 } from './dropdown';
import { default as s4 } from './dropdown.tsx?raw';

import { default as C5 } from './multip-dropdown';
import { default as s5 } from './multip-dropdown.tsx?raw';

import { default as C6 } from './context';
import { default as s6 } from './context.tsx?raw';

import { default as C7 } from './empty-dropdown';
import { default as s7 } from './empty-dropdown.tsx?raw';

import { default as C8 } from './custom';
import { default as s8 } from './custom.tsx?raw';

import { default as C9 } from './onpopover';
import { default as s9 } from './onpopover.tsx?raw';

import { default as api } from './api.json';

export default function(): JSX.Element {
    return <Stages dir='demo/menu' api={api} stages={[
        { component: C4, source: s4, title: 'dropdown' },
        { component: C5, source: s5, title: 'multip-dropdown' },
        { component: C6, source: s6, title: 'context' },
        { component: C7, source: s7, title: 'empty-dropdown', desc: '下拉菜单内容为空' },
        { component: C8, source: s8, title: 'custom', desc: '自定义触发条件' },
        { component: C9, source: s9, title: 'onpopover', desc: '由 onPopover 阻止弹出菜单' },
    ]}>
    </Stages>;
}
