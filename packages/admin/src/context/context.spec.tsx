// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { HashRouter } from '@solidjs/router';
import { describe, test } from 'vitest';

import { options } from '@/options/options.spec';
import { Provider } from './context';

describe('context', async () => {
    test('buildContext', async () => {
        <HashRouter root={()=><Provider {...options}>root</Provider>}></HashRouter>;
    });
});