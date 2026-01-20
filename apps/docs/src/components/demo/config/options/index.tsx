// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Type } from '@cmfx/vite-plugin-api';
import IconOptionsConfig from '~icons/eva/options-2-fill';

import type { Info } from '@docs/components/base';

import { default as C1 } from './options';
import { default as s1 } from './options.tsx?raw';

import { default as api } from './api.json' with { type: 'json' };

export default function(): Info {
    return {
        kind: 'config', title: '_d.demo.optionsConfig', icon: IconOptionsConfig, path: 'config/options',
        desc: '经由 `run` 方法传入的一个全局性配置对象。',
        api: api as Array<Type>, stages: [
            { component: C1, source: s1, title: 'config' },
        ]
    };
}
