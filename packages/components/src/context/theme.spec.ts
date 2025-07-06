// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { expect, test } from 'vitest';

import { Theme, applyTheme, hasTheme } from './theme';

test('theme', () => {
    let t: Theme = { scheme: {} };

    expect(t.mode).toBeUndefined();

    let div = document.createElement('div');
    applyTheme(div, t);
    expect(hasTheme(div)).toBeTruthy();

    t = { scheme: {}, mode: 'dark' };
    expect(t.mode).toEqual('dark');

    div = document.createElement('div');
    applyTheme(div, t);
    expect(hasTheme(div)).toBeTruthy();
});
