// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { expect, test } from 'vitest';

import { changeScheme } from './scheme';

test('changeScheme', () => {
    const parent = document.createElement('div');
    const child1 = document.createElement('div');
    const child2 = document.createElement('div');
    parent.appendChild(child1);
    child1.appendChild(child2);

    changeScheme(parent, {'--dark-primary-bg': '#000'});
    changeScheme(child1, {'--dark-primary-bg': '#111'});
    changeScheme(child2);

    expect(parent.style.getPropertyValue('--dark-primary-bg')).toEqual('#000');
    expect(child1.style.getPropertyValue('--dark-primary-bg')).toEqual('#111');
    expect(child2.style.getPropertyValue('--dark-primary-bg')).toBeFalsy();
});
