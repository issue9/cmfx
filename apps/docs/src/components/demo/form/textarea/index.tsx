// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Type } from '@cmfx/vite-plugin-api';
import IconTextarea from '~icons/bi/textarea-resize';

import type { Info } from '@docs/components/base';
import { Stages } from '@docs/components/stages';

import { default as api } from './api.json' with { type: 'json' };

import { default as Textarea } from './textarea';
import { default as textarea } from './textarea.tsx?raw';

export default function(): Info {
    return {
        info: { title: '_d.demo.textarea', icon: <IconTextarea /> },
        kind: 'data-input', path: 'form/textarea', component: () =>
            <Stages dir='form/textarea' api={api as Array<Type>} stages={[
                { component: Textarea, source: textarea, title: 'textarea' },
            ]}>
            </Stages>,
    };
}
