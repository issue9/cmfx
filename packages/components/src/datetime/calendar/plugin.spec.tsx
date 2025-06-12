// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { expect, test } from 'vitest';
import { JSX } from 'solid-js';

import {lunarPlugin} from './plugin';

test('lunarPlugin', async () => {
    expect(lunarPlugin(new Date('2025-05-01'))).toEqual<JSX.Element>('初四');
    expect(lunarPlugin(new Date('2025-05-27'))).toEqual<JSX.Element>('五月');
});