// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { Stages } from '../../stages';

import { default as C1 } from './number';
import { default as s1 } from './number.tsx?raw';

import { default as C2 } from './multiple';
import { default as s2 } from './multiple.tsx?raw';

import { default as C3 } from './anchor';
import { default as s3 } from './anchor.tsx?raw';

import { default as C4 } from './dropdown';
import { default as s4 } from './dropdown.tsx?raw';

import { default as C5 } from './multip-dropdown';
import { default as s5 } from './multip-dropdown.tsx?raw';

import { default as C6 } from './context';
import { default as s6 } from './context.tsx?raw';

import { default as api } from './api.json';

export default function(): JSX.Element {
    return <Stages api={api} stages={[
        { component: <C1 />, source: s1, height: 800, title: '数字作为值' },
        { component: <C2 />, source: s2, title: '多选' },
        { component: <C3 />, source: s3, title: '链接' },
        { component: <C4 />, source: s4, title: 'dropdown' },
        { component: <C5 />, source: s5, title: 'multip-dropdown' },
        { component: <C6 />, source: s6, title: 'context' },
    ]}>
    </Stages>;
}
