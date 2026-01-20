// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Type } from '@cmfx/vite-plugin-api';
import IconAvatar from '~icons/material-symbols/person';

import type { Info } from '@docs/components/base';

import { default as Avatar } from './avatar';
import { default as avatar } from './avatar.tsx?raw';

import { default as Alt } from './fallback';
import { default as alt } from './fallback.tsx?raw';

import { default as Hover } from './hover';
import { default as hover } from './hover.tsx?raw';

import { default as api } from './api.json' with { type: 'json' };

export default function(): Info {
    return {
        kind: 'data-display', title: '_d.demo.avatar', icon: IconAvatar, path: 'avatar',
        api: api as Array<Type>, stages: [
            { component: Avatar, source: avatar, title: '基本功能' },
            { component: Alt, source: alt, title: '无图片' },
            { component: Hover, source: hover, title: 'hover' },
        ]
    };
}
