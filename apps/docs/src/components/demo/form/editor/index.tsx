// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Type } from '@cmfx/vite-plugin-api';
import IconEditor from '~icons/material-symbols/wysiwyg';

import type { Info } from '@docs/components/base';
import { Stages } from '@docs/components/stages';

import { default as api } from './api.json' with { type: 'json' };

import { default as Snow } from './snow';
import { default as snow } from './snow.tsx?raw';

import { default as Bubble } from './bubble';
import { default as bubble } from './bubble.tsx?raw';

export default function(): Info {
    return {
        kind: 'data-input', title: '_d.demo.editor', icon: IconEditor, path: 'form/editor',
        component: () => <Stages dir='form/editor' api={api as Array<Type>} stages={[
            { component: Snow, source: snow, title: '默认的编辑器' },
            { component: Bubble, source: bubble, title: '简单的编辑器' },
        ]}>
        </Stages>,
    };
}
