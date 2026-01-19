// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Type } from '@cmfx/vite-plugin-api';
import IconIcon from '~icons/tdesign/icon-filled';

import type { Info } from '@docs/components/base';
import { Stages } from '@docs/components/stages';

import { default as api } from './api.json' with { type: 'json' };

import { default as Text } from './text';
import { default as text } from './text.tsx?raw';

import { default as IconSet } from './iconset';
import { default as iconSet } from './iconset.tsx?raw';

export default function(): Info {
    return {
        info: { title: '_d.demo.icon', icon: <IconIcon /> },
        kind: 'general', path: 'icon', component: () =>
            <Stages dir='icon' api={api as Array<Type>} stages={[
                { component: Text, source: text, title: '与文本的排版' },
                { component: IconSet, source: iconSet, title: '图标集' },
            ]}>
            </Stages>,
    };
}
