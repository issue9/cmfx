// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { Stages } from '../../../stages';

import { default as Dropdown } from './dropdown';
import { default as dropdown } from './dropdown.tsx?raw';

import { default as Multip } from './multip';
import { default as multip } from './multip.tsx?raw';

import { default as Context } from './context';
import { default as context } from './context.tsx?raw';

import { default as Empty } from './empty';
import { default as empty } from './empty.tsx?raw';

import { default as Custom } from './custom';
import { default as custom } from './custom.tsx?raw';

import { default as OnPopover } from './onpopover';
import { default as onpopover } from './onpopover.tsx?raw';

import { default as api } from './api.json';

export default function(): JSX.Element {
    return <Stages dir='demo/menu' api={api} stages={[
        { component: Dropdown, source: dropdown, title: 'dropdown' },
        { component: Multip, source: multip, title: 'multip-dropdown' },
        { component: Context, source: context, title: 'context' },
        { component: Empty, source: empty, title: 'empty-dropdown', desc: '下拉菜单内容为空' },
        { component: Custom, source: custom, title: 'custom', desc: '自定义触发条件' },
        { component: OnPopover, source: onpopover, title: 'onpopover', desc: '由 onPopover 阻止弹出菜单' },
    ]}>
    </Stages>;
}
