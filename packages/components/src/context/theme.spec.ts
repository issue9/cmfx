// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { expect, test } from 'vitest';

import { schemes } from '@components/theme';
import { Theme, applyTheme, hasTheme } from './theme';

test('theme', () => {
    let t: Theme = { scheme: schemes.green, mode: 'light' };

    let div = document.createElement('div');
    applyTheme(div, t);
    expect(hasTheme(div)).toBeTruthy();

    t = { scheme: schemes.green, mode: 'dark' };
    expect(t.mode).toEqual('dark');

    div = document.createElement('div');
    applyTheme(div, t);
    expect(hasTheme(div)).toBeTruthy();
});
