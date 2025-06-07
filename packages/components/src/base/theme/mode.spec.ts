// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { expect, test } from 'vitest';

import { changeMode, modeValues } from './mode';

test('changeMode', () => {
    const parent = document.createElement('div');
    const child1 = document.createElement('div');
    const child2 = document.createElement('div');
    parent.appendChild(child1);
    child1.appendChild(child2);

    changeMode(parent, 'dark');
    changeMode(child1, 'system');
    changeMode(child2);

    expect(parent.style.getPropertyValue('color-scheme')).toEqual(modeValues.get('dark'));
    expect(child1.style.getPropertyValue('color-scheme')).toEqual(modeValues.get('system'));
    expect(child2.style.getPropertyValue('color-scheme')).toBeFalsy();
});