// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { HashRouter } from '@solidjs/router';
import { describe, test } from 'vitest';

import { Provider } from './context';
import { options } from './options/options.spec';

describe('context', async () => {
    test('buildContext', async () => {
        <Provider {...options}><HashRouter root={()=>'root'}></HashRouter></Provider>;
    });
});