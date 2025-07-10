// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';
import { expect, test } from 'vitest';

import { lunarPlugin } from './plugin';

test('lunarPlugin', async () => {
    expect(lunarPlugin(new Date('2025-05-01'))).toEqual<JSX.Element>('初四');
    expect(lunarPlugin(new Date('2025-05-27'))).toEqual<JSX.Element>('五月');
    expect(lunarPlugin(new Date('2025-05-27'))).toEqual<JSX.Element>('五月');
    expect(lunarPlugin(new Date('2024-12-1'))).toEqual<JSX.Element>('十一月');
});
