// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { Stages } from '../../stages';

import { default as Basic } from './basic';
import { default as basic } from './basic.tsx?raw';

import { default as System } from './system';
import { default as system } from './system.tsx?raw';

import { default as Dialog } from './dialog';
import { default as dialog } from './dialog.tsx?raw';

import { default as Scroller } from './scroller';
import { default as scroller } from './scroller.tsx?raw';

import { default as api } from './api.json';

export default function(): JSX.Element {
    return <Stages dir='demo/dialog' api={api} stages={[
        { component: Basic, source: basic, title: '基本功能' },
        { component: System, source: system, title: '替换系统对话框' },
        { component: Dialog, source: dialog, title: '对话框' },
        { component: Scroller, source: scroller, title: '可滚动' },
    ]}>
    </Stages>;
}
