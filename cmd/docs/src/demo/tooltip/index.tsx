// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { useLocale } from '@cmfx/components';
import { JSX } from 'solid-js';

import { Stages } from '../../stages';

import { default as C1 } from './demo';
import { default as s1 } from './demo.tsx?raw';

import { default as C2 } from './demo2';
import { default as s2 } from './demo2.tsx?raw';

import { default as api } from './api.json';

export default function(): JSX.Element {
    const l = useLocale();

    return <Stages title={l.t('_d.demo.tooltip')} api={api} stages={[
        { component: <C1 />, source: s1, title: 't1', desc: '这是一段描述信息' },
        { component: <C2 />, source: s2, title: 't2' },
    ]}>
        这是一个弹出提示组件
    </Stages>;
}
