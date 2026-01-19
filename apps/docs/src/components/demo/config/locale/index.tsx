// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Type } from '@cmfx/vite-plugin-api';
import IconLocaleConfig from '~icons/fluent-mdl2/locale-language';

import type { Info } from '@docs/components/base';
import { Stages } from '@docs/components/stages';

import { default as Locale } from './locale';
import { default as locale } from './locale.tsx?raw';

import { default as Global } from './global';
import { default as global } from './global.tsx?raw';

import { default as Other } from './other';
import { default as other } from './other.tsx?raw';

import { default as Nested } from './nested';
import { default as nested } from './nested.tsx?raw';

import { default as api } from './api.json' with { type: 'json' };

export default function(): Info {
    return {
        info: { title: '_d.demo.localeConfig', icon: <IconLocaleConfig /> },
        kind: 'config', path: 'config/locale', component: () =>
            <Stages dir='config/locale' api={api as Array<Type>} stages={[
                { component: Locale, source: locale, title: 'LocaleProvider', desc: '可通过 `LocaleProvider` 的属性修改所包含内容的语言。' },
                { component: Global, source: global, title: 'setLocale', desc: '可通过 `setLocale` 修改全局的本地化内容。' },
                { component: Other, source: other, title: '其它属性' },
                { component: Nested, source: nested, title: '嵌套使用' },
            ]}>
            </Stages>,
    };
}
