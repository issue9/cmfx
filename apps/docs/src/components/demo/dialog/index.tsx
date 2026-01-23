// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconDialog from '~icons/material-symbols/dialogs-outline-rounded';

import type { Info } from '@docs/components/base';

import { default as Basic } from './basic';
import { default as basic } from './basic.tsx?raw';

import { default as System } from './system';
import { default as system } from './system.tsx?raw';

import { default as Dialog } from './dialog';
import { default as dialog } from './dialog.tsx?raw';

import { default as Scroller } from './scroller';
import { default as scroller } from './scroller.tsx?raw';

export default function(): Info {
    return {
        kind: 'feedback', title: '_d.demo.dialog', icon: IconDialog, path: 'dialog',
        api: import.meta.glob('./api.*.json', { eager: true, import: 'default' }),
        stages: [
            { component: Basic, source: basic, title: '基本功能' },
            { component: System, source: system, title: '替换系统对话框' },
            { component: Dialog, source: dialog, title: '对话框' },
            { component: Scroller, source: scroller, title: '可滚动' },
        ]
    };
}
