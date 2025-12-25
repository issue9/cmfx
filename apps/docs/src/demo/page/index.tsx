// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { default as api } from './api.json';

import { default as Page } from './page';
import { default as page } from './page.tsx?raw';

import { Stages } from '../../stages';

export default function(): JSX.Element {
    return <Stages dir='demo/page' api={api} stages={[
        { component: Page, source: page, title: '基本用法' },
    ]}>
    </Stages>;
}
