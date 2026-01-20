// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Type } from '@cmfx/vite-plugin-api';
import IconBadge from '~icons/f7/app-badge-fill';

import type { Info } from '@docs/components/base';

import { default as Basic } from './basic';
import { default as basic } from './basic.tsx?raw';

import { default as Text } from './text';
import { default as text } from './text.tsx?raw';

import { default as Long } from './long';
import { default as long } from './long.tsx?raw';

import { default as Icon } from './icon';
import { default as icon } from './icon.tsx?raw';

import { default as api } from './api.json' with { type: 'json' };

export default function(): Info {
    return {
        kind: 'feedback', title: '_d.demo.badge', icon: IconBadge, path: 'badge',
        api: api as Array<Type>, stages: [
            { component: Basic, source: basic, title: '基本功能' },
            { component: Text, source: text, title: '文本' },
            { component: Long, source: long, title: '长文本' },
            { component: Icon, source: icon, title: '图标' },
        ]
    };
}
