// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Type } from '@cmfx/vite-plugin-api';
import IconMisc from '~icons/eos-icons/miscellaneous';

import type { Info } from '@docs/components/base';
import { Stages } from '@docs/components/stages';

import { default as api } from './api.json' with { type: 'json' };

export default function(): Info {
    return {
        info: { title: '_d.demo.misc', icon: <IconMisc /> },
        kind: 'function', path: 'functions/misc', component: () =>
            <Stages dir='functions/misc' api={api as Array<Type>} />,
    };
}
