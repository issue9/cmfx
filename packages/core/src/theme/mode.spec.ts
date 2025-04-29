// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { expect, test } from 'vitest';

import { changeMode, modeValues } from './mode';

test('changeMode', () => {
    const parent = document.createElement('div');
    const child = document.createElement('div');
    parent.appendChild(child);

    changeMode(parent, 'dark');
    changeMode(child, 'system');

    expect(parent.style.getPropertyValue('color-scheme')).toEqual(modeValues.get('dark'));
    expect(child.style.getPropertyValue('color-scheme')).toEqual(modeValues.get('system'));
});