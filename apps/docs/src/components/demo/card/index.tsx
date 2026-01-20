// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Type } from '@cmfx/vite-plugin-api';
import IconCard from '~icons/mdi/card';

import type { Info } from '@docs/components/base';
import { Stages } from '@docs/components/stages';

import { default as Header } from './header';
import { default as header } from './header.tsx?raw';

import { default as Footer } from './footer';
import { default as footer } from './footer.tsx?raw';

import { default as api } from './api.json' with { type: 'json' };

export default function(): Info {
    return {
        kind: 'general', title: '_d.demo.card', icon: IconCard, path: 'card',
        component: () => <Stages dir='card' api={api as Array<Type>} stages={[
            { component: Header, source: header, title: 'header' },
            { component: Footer, source: footer, title: 'footer' },
        ]}>
        </Stages>,
    };
}
