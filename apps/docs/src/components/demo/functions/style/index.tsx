// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Type } from '@cmfx/vite-plugin-api';
import IconStyle from '~icons/material-symbols/style-outline';

import type { Info } from '@docs/components/base';
import { Stages } from '@docs/components/stages';

import { default as api } from './api.json' with { type: 'json' };

export default function(): Info {
    return {
        info: { title: '_d.demo.style', icon: <IconStyle /> },
        kind: 'function', path: 'functions/style', component: () =>
            <Stages dir='functions/style' api={api as Array<Type>}>
                提供了与样式相关的功能
            </Stages>,
    };
}
