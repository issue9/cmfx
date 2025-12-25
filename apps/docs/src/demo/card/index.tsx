// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { Stages } from '../../stages';

import { default as Header } from './header';
import { default as header } from './header.tsx?raw';

import { default as Footer } from './footer';
import { default as footer } from './footer.tsx?raw';

import { default as api } from './api.json';

export default function(): JSX.Element {
    return <Stages dir='demo/card' api={api} stages={[
        { component: Header, source: header, title: 'header' },
        { component: Footer, source: footer, title: 'footer' },
    ]}>
    </Stages>;
}
