// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { useLocale } from '@cmfx/components';
import { JSX } from 'solid-js';

import { Stages } from '../../stages';

import { default as C1 } from './500';
import { default as s1 } from './500.tsx?raw';

import { default as C2 } from './bug';
import { default as s2 } from './bug.tsx?raw';

import { default as C3 } from './build';
import { default as s3 } from './build.tsx?raw';

import { default as api } from './api.json';

export default function(): JSX.Element {
    const l = useLocale();

    return <Stages title={l.t('_d.demo.result')} api={api} stages={[
        { component: <C1 />, source: s1, title: '500' },
        { component: <C2 />, source: s2, title: 'bug' },
        { component: <C3 />, source: s3, title: 'build' },
    ]}>
        用于是展示一操作的结果页
    </Stages>;
}
